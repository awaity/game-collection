import assert from 'node:assert/strict';
import test from 'node:test';
import {parseCommit,treeChanges} from '../scripts/github-git.mjs';

test('GitHub upload preserves author time zones and exact multiline messages',()=>{
  const message='feat(game): 发布试玩\n\n说明中的 `代码` 与 $() 保持字面值。\n';
  const commit=parseCommit(`tree ${'1'.repeat(40)}\nparent ${'2'.repeat(40)}\nauthor Player <player@example.test> 0 +0800\ncommitter Player <player@example.test> 0 -0330\n\n${message}`);
  assert.equal(commit.author.date,'1970-01-01T08:00:00+08:00');
  assert.equal(commit.committer.date,'1969-12-31T20:30:00-03:30');
  assert.equal(commit.message,message);
});

test('GitHub upload rejects histories it cannot reproduce without changing commit hashes',()=>{
  const base=`tree ${'1'.repeat(40)}\nparent ${'2'.repeat(40)}\nauthor Player <p@example.test> 0 +0000\ncommitter Player <p@example.test> 0 +0000`;
  assert.throws(()=>parseCommit(base.replace('\nauthor',`\nparent ${'3'.repeat(40)}\nauthor`)+'\n\nmerge\n'),/unsigned linear/);
  assert.throws(()=>parseCommit(base+'\ngpgsig signature\n\nmessage\n'),/unsigned linear/);
  assert.throws(()=>parseCommit(base.replace('1'.repeat(40),'invalid')+'\n\nmessage\n'));
});

test('publication removes an obsolete game directory without disturbing retained games',()=>{
  const file=(path,sha)=>({path,mode:'100644',type:'blob',sha});
  const before=[file('games/old/index.html','a'),file('games/old/assets/main.js','b'),file('games/keep/index.html','c')];
  const after=[before[2],file('games/new/index.html','d')];
  assert.deepEqual(treeChanges(before,after),[{path:'games/old',mode:'040000',type:'tree',sha:null},after[1]]);
});

test('publication handles renamed bundles, changed files and permissions while preserving their directory',()=>{
  const file=(path,sha,mode='100644')=>({path,mode,type:'blob',sha});
  const before=[file('assets/old.js','a'),file('assets/style.css','b'),file('index.html','c'),file('script','d')];
  const after=[file('assets/new.js','e'),before[1],file('index.html','f'),file('script','d','100755')];
  assert.deepEqual(treeChanges(before,after),[{path:'assets/old.js',mode:'100644',type:'blob',sha:null},after[0],after[2],after[3]]);
});
