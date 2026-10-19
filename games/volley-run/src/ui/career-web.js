import {drawCareerCanvas} from '@game-collection/platform/progression-panel';
/** Same Canvas layout as native; real HTML buttons preserve keyboard access. */
export function mountCareer(panel){
 const layer=document.createElement('div');layer.className='career-screen';layer.hidden=true;layer.setAttribute('role','dialog');layer.setAttribute('aria-label','小队集合站');
 const canvas=document.createElement('canvas'),controls=document.createElement('div');layer.append(canvas,controls);document.body.append(layer);
 function draw(){
  layer.hidden=!panel.active;if(!panel.active)return;
  const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
  const buttons=drawCareerCanvas(ctx,panel,w,h,false,12,24),focused=document.activeElement?.dataset.action;controls.replaceChildren();
  for(const b of buttons){const button=document.createElement('button');button.dataset.action=b.id;button.textContent=b.label;button.disabled=!!b.disabled;button.style.cssText=`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;opacity:0;`;button.onclick=()=>{panel.action(b.id);draw()};controls.append(button);}
  if(focused)controls.querySelector(`[data-action="${focused}"]`)?.focus({preventScroll:true});
 }
 addEventListener('resize',()=>{if(panel.active)draw()});layer.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.active=false;draw();e.stopPropagation();}});
 return {open(){panel.open();draw();controls.querySelector('button')?.focus()},draw};
}
