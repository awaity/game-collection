import './style.css';
import { App } from './app';
import { WebPlatform } from './platform/web';

try{
  const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
  const app=new App(new WebPlatform(canvas));
  const controls=document.querySelector<HTMLDivElement>('#accessible-controls')!;
  // Web-only semantic mirrors make the same Canvas menu keyboard accessible.
  const update=()=>{
    const focused=(document.activeElement as HTMLElement)?.dataset?.action;
    controls.replaceChildren();
    for(const button of app.ui.buttons){
      const b=document.createElement('button');b.type='button';b.dataset.action=button.id;b.textContent=button.label;
      b.setAttribute('aria-label',button.id==='pause'?'暂停游戏':button.id==='sound'?(app.sound?'关闭声音':'开启声音'):button.label);
      b.style.cssText=`left:${button.x/420*100}%;top:${button.y/app.height*100}%;width:${button.w/420*100}%;height:${button.h/app.height*100}%`;
      b.onclick=()=>app.action(button.id);controls.append(b);if(focused===button.id)b.focus({preventScroll:true});
    }
    document.querySelector('#game-status')!.textContent=app.game.phase==='won'?'通关成功，尸王已击败':app.game.phase==='lost'?'防线失守，可以再试一次':app.game.phase==='paused'?'游戏已暂停':app.game.phase==='playing'?`第 ${app.game.wave} 波，防线 ${Math.ceil(app.game.hp)}，${app.game.weapon.name}`:'点击开始守线，左右拖动，自动开火';
  };
  app.onUIChange=update;update();
  if(new URLSearchParams(location.search).get('qa')==='1'){
    Object.assign(window,{__ZOMBIE__:{snapshot:()=>app.game.summary(),buttons:()=>app.ui.buttons,advance:(ticks:number,target?:number,bomb=false)=>app.advance(ticks,target,bomb),action:(id:string)=>app.action(id),game:app.game,app}});
  }
}catch(error){console.error(error);document.querySelector<HTMLDivElement>('#boot-error')!.hidden=false;}
