import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir,devNull} from 'node:os';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {root} from './site-config.mjs';

const repository='https://api.github.com/repos/awaity/game-collection';
const git=(args,options={})=>execFileSync('git',args,{cwd:root,stdio:['pipe','pipe','pipe'],maxBuffer:64*1024*1024,timeout:30000,...options,env:{...process.env,...options.env,GIT_NO_LAZY_FETCH:'1'}});
const sha=value=>{assert.match(value,/^[a-f0-9]{40}$/);return value;};

export function parseCommit(raw){
  const split=raw.indexOf('\n\n');assert.ok(split>0,'Malformed commit');
  const lines=raw.slice(0,split).split('\n'),data={};
  assert.deepEqual(lines.map(line=>line.split(' ',1)[0]),['tree','parent','author','committer'],'Only unsigned linear commits are supported');
  for(const line of lines){const i=line.indexOf(' ');data[line.slice(0,i)]=line.slice(i+1);}
  const person=value=>{
    const m=/^(.*) <([^>]*)> (\d+) ([+-])(\d{2})(\d{2})$/.exec(value);assert.ok(m,'Malformed commit identity');
    const [,name,email,seconds,sign,hours,minutes]=m,offset=(Number(hours)*60+Number(minutes))*(sign==='+'?1:-1);
    // Preserve the original zone: changing +0800 to Z changes the Git object.
    const date=new Date((Number(seconds)+offset*60)*1000).toISOString().slice(0,19)+`${sign}${hours}:${minutes}`;
    return {name,email,date};
  };
  return {tree:sha(data.tree),parents:[sha(data.parent)],author:person(data.author),committer:person(data.committer),message:raw.slice(split+2)};
}

function localTree(tree){
  return git(['ls-tree','-rz',tree]).toString().split('\0').filter(Boolean).map(record=>{
    const i=record.indexOf('\t'),[mode,type,id]=record.slice(0,i).split(' ');
    return {path:record.slice(i+1),mode,type,sha:sha(id)};
  });
}

export function treeChanges(before,after){
  const old=new Map(before.map(entry=>[entry.path,entry]));
  const next=new Map(after.map(entry=>[entry.path,entry]));
  const directories=entries=>new Set(entries.flatMap(entry=>entry.path.split('/').slice(0,-1).map((_,i)=>entry.path.split('/').slice(0,i+1).join('/'))));
  const oldDirs=directories(before),newDirs=directories(after);
  const removed=[...oldDirs].filter(dir=>!newDirs.has(dir));
  const removedRoots=removed.filter(dir=>!removed.some(parent=>dir.startsWith(parent+'/')));
  const changes=removedRoots.map(path=>({path,mode:'040000',type:'tree',sha:null}));
  for(const entry of before)if(!next.has(entry.path)&&!removedRoots.some(dir=>entry.path.startsWith(dir+'/')))
    changes.push({path:entry.path,mode:entry.mode,type:entry.type,sha:null});
  for(const entry of after){
    const prior=old.get(entry.path);
    if(!prior||prior.sha!==entry.sha||prior.mode!==entry.mode||prior.type!==entry.type)changes.push(entry);
  }
  return changes;
}

export async function createGitHubPublisher(){
  let credential;
  try {
    credential=git(['credential','fill'],{input:'protocol=https\nhost=github.com\npath=awaity/game-collection.git\n\n',env:{...process.env,GIT_TERMINAL_PROMPT:'0'},timeout:10000});
  }catch{throw Error('Git credential helper could not authenticate this repository.');}
  const fields=Object.fromEntries(credential.toString().split('\n').filter(line=>line.includes('=')).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
  assert.ok(fields.username&&fields.password,'Git credential helper did not return an HTTPS identity');
  const authorization='Basic '+Buffer.from(fields.username+':'+fields.password).toString('base64');
  credential.fill(0);delete fields.password;delete fields.username;

  async function api(endpoint,body,method=body===undefined?'GET':'POST'){
    // Keep authentication inside this repository's API calls. Never follow a
    // redirect, log headers, persist credentials, or change global Git config.
    assert.ok(endpoint.startsWith('/git/'));
    let response;
    for(let attempt=0;attempt<3;attempt++){
      try {
        response=await fetch(repository+endpoint,{method,redirect:'error',signal:AbortSignal.timeout(30000),headers:{
          Accept:'application/vnd.github+json',Authorization:authorization,'Content-Type':'application/json',
          'X-GitHub-Api-Version':'2022-11-28','User-Agent':'game-collection-publisher',
        },body:body===undefined?undefined:JSON.stringify(body)});
      }catch{
        if(method!=='PATCH'&&attempt<2){await delay(1000*2**attempt);continue;}
        throw Error(`GitHub API connection failed for ${method} ${endpoint}; remote state must be checked before retrying.`);
      }
      if(method!=='PATCH'&&[502,503,504].includes(response.status)&&attempt<2){
        await response.arrayBuffer();await delay(1000*2**attempt);continue;
      }
      break;
    }
    if(!response.ok)throw Error(`GitHub API ${method} ${endpoint} returned HTTP ${response.status}`);
    const result=await response.json();
    if(method!=='GET')await delay(850); // Stay below secondary content-creation limits.
    return result;
  }
  const ref=async branch=>sha((await api('/git/ref/heads/'+branch)).object.sha);
  async function remoteTree(commit){
    const tree=sha((await api('/git/commits/'+commit)).tree.sha);
    const result=await api('/git/trees/'+tree+'?recursive=1');
    assert.equal(result.truncated,false,'Remote tree must be complete before publishing');
    return {tree,entries:result.tree.filter(entry=>entry.type!=='tree')};
  }
  async function uploadTree(tree,known,base){
    const entries=localTree(tree),pending=[...new Set(entries.filter(entry=>entry.type==='blob'&&!known.has(entry.sha)).map(entry=>entry.sha))];
    console.log(`GitHub: 上传 ${pending.length} 个新文件对象，保留 ${entries.length} 个文件条目。`);
    for(const [i,id]of pending.entries()){
      const data=git(['cat-file','blob',id]);assert.ok(data.length<100*1024*1024,'GitHub file size limit');
      const result=await api('/git/blobs',{encoding:'base64',content:data.toString('base64')});
      assert.equal(result.sha,id,'Uploaded blob does not match local source');known.add(id);
      if((i+1)%10===0||i===pending.length-1)console.log(`GitHub 文件对象 ${i+1}/${pending.length}`);
    }
    // Send only changed entries, including obsolete directories, to avoid a
    // large full-tree reconstruction. Still require the exact complete SHA.
    const result=await api('/git/trees',{base_tree:base.tree,tree:treeChanges(base.entries,entries)});
    assert.equal(result.sha,tree,'Uploaded tree does not match local source');
    return {tree,entries};
  }
  async function uploadCommit(revision,parent,known,base){
    const body=parseCommit(git(['cat-file','commit',revision]).toString());
    assert.equal(body.parents[0],parent,'Publication must preserve linear history');
    const uploaded=await uploadTree(body.tree,known,base);
    const result=await api('/git/commits',body);assert.equal(result.sha,revision,'Uploaded commit hash differs; branch remains unchanged');
    console.log('GitHub 提交已核对：'+revision);
    return uploaded;
  }
  async function advance(branch,before,after){
    assert.ok(['main','gh-pages'].includes(branch));
    assert.equal(await ref(branch),before,'Remote branch advanced during upload; refusing to overwrite');
    const result=await api('/git/refs/heads/'+branch,{sha:after,force:false},'PATCH');
    assert.equal(result.object.sha,after);assert.equal(await ref(branch),after);
    const name='refs/remotes/origin/'+branch;
    let old='0'.repeat(40);try{old=git(['rev-parse','--verify',name]).toString().trim();}catch{}
    git(['update-ref',name,after,old]);
  }
  async function publishMain(revision){
    sha(revision);const before=await ref('main');if(before===revision)return {before,revision,commits:[]};
    try{git(['merge-base','--is-ancestor',before,revision]);}catch{throw Error('Remote main is not an ancestor of the checked source.');}
    let base=await remoteTree(before);const known=new Set(base.entries.map(entry=>entry.sha));
    const commits=git(['rev-list','--reverse',before+'..'+revision]).toString().trim().split('\n');
    let parent=before;
    for(const commit of commits){base=await uploadCommit(sha(commit),parent,known,base);parent=commit;}
    await advance('main',before,revision);return {before,revision,commits};
  }
  async function publishSite(siteDir,sourceRevision){
    assert.equal(await ref('main'),sourceRevision,'Publish the verified source first');
    const before=await ref('gh-pages'),base=await remoteTree(before),temp=await mkdtemp(path.join(tmpdir(),'game-collection-pages-'));
    let tree;
    try{
      const env={...process.env,GIT_INDEX_FILE:path.join(temp,'index'),GIT_WORK_TREE:siteDir,GIT_ATTR_NOSYSTEM:'1'};
      git(['read-tree','--empty'],{env});
      git(['-c','core.autocrlf=false','-c','core.attributesfile='+devNull,'add','--all','--force'],{env,cwd:siteDir});
      tree=sha(git(['write-tree'],{env}).toString().trim());
    }finally{await rm(temp,{recursive:true,force:true});}
    const author=git(['var','GIT_AUTHOR_IDENT']).toString().trim(),committer=git(['var','GIT_COMMITTER_IDENT']).toString().trim();
    const raw=`tree ${tree}\nparent ${before}\nauthor ${author}\ncommitter ${committer}\n\nchore(pages): 发布游戏合集 ${sourceRevision.slice(0,8)}\n`;
    const revision=sha(git(['hash-object','-t','commit','-w','--stdin'],{input:raw}).toString().trim());
    await uploadCommit(revision,before,new Set(base.entries.map(entry=>entry.sha)),base);
    await advance('gh-pages',before,revision);
    return {before,revision,tree,sourceRevision};
  }
  return {publishMain,publishSite};
}
