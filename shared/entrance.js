(() => {
  const layer=document.getElementById('collection-entrance');if(!layer)return;
  const skip=layer.querySelector('[data-skip]'),status=layer.querySelector('.entrance-status'),retry=layer.querySelector('[data-retry]'),back=layer.querySelector('[data-back]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,locked=new Map(),held=new Set();
  let ready=false,leaving=false,timer,timeout;
  function lock(){for(const el of document.body.children)if(el!==layer&&el.tagName!=='SCRIPT'&&!locked.has(el)){locked.set(el,el.inert);el.inert=true;}}
  const children=new MutationObserver(lock);children.observe(document.body,{childList:true});lock();layer.focus({preventScroll:true});
  const at=location.pathname.indexOf('/games/');
  back.href=at>=0?location.pathname.slice(0,at+1):'../../';
  function finish(){
    if(!ready||leaving)return;leaving=true;clearTimeout(timer);clearTimeout(timeout);children.disconnect();observer.disconnect();document.removeEventListener('collection:statechange',check);
    window.removeEventListener('error',failed);window.removeEventListener('unhandledrejection',failed);
    layer.dataset.leaving='true';
    setTimeout(()=>{for(const [el,inert] of locked)el.inert=inert;layer.remove();document.documentElement.dataset.collectionEntrance='done';document.querySelector('canvas')?.focus({preventScroll:true});if(!held.size)releaseKeys();},reduced?0:330);
  }
  function check(){if(ready||!['menu','playing','paused','result'].includes(document.documentElement.dataset.collectionState))return;ready=true;skip.disabled=false;skip.hidden=false;retry.hidden=back.hidden=true;status.textContent='准备好，开一局。';timer=setTimeout(finish,reduced?120:850);}
  function failed(){if(leaving||ready)return;status.textContent='游戏准备遇到问题，请重试。';retry.hidden=false;back.hidden=false;skip.hidden=true;}
  function releaseKeys(){document.removeEventListener('keydown',key,true);document.removeEventListener('keyup',keyUp,true);}
  function key(e){
    if(!layer.isConnected&&!held.has(e.code))return;
    if(e.ctrlKey||e.metaKey||e.altKey||e.key==='F5')return;
    if(e.key==='Tab'){
      const buttons=[...layer.querySelectorAll('button:not(:disabled),a[href]')].filter(el=>!el.hidden);
      e.preventDefault();e.stopImmediatePropagation();
      if(!buttons.length)layer.focus();else {const i=buttons.indexOf(document.activeElement);buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus();}return;
    }
    if(!leaving&&(e.target===retry||e.target===back)&&['Enter',' '].includes(e.key))return;
    held.add(e.code);e.preventDefault();e.stopImmediatePropagation();
    if(ready&&['Enter',' ','Escape'].includes(e.key))finish();
  }
  function keyUp(e){if(!held.delete(e.code))return;e.preventDefault();e.stopImmediatePropagation();if(!layer.isConnected&&!held.size)releaseKeys();}
  skip.addEventListener('click',finish);retry.addEventListener('click',()=>location.reload());document.addEventListener('keydown',key,true);document.addEventListener('keyup',keyUp,true);
  document.addEventListener('collection:statechange',check);window.addEventListener('error',failed);window.addEventListener('unhandledrejection',failed);
  const observer=new MutationObserver(check);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-collection-state']});
  timeout=setTimeout(()=>{if(!ready){status.textContent='准备时间较长，可以重试或返回大厅。';retry.hidden=false;back.hidden=false;}},15000);check();
})();
