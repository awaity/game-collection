import {sys} from 'cc';
import {Career} from 'db://assets/collection/platform/progression';
import {CareerPanel,type Destination} from 'db://assets/collection/platform/progression-panel';
import type {GameView} from './runtime';
export {Career, CareerPanel};
export function loadCareer(slug:string){
  const key=slug+'.career.v1';let raw:unknown;try{raw=JSON.parse(sys.localStorage.getItem(key)||'null')}catch{}
  return new Career(raw,value=>{try{sys.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}});
}
export function drawCareer(ui:GameView,panel:CareerPanel){
  panel.draw({panel:(id,x,y,w,h,c)=>{ui.panel(id,x+w/2-ui.width/2,ui.height/2-y-h/2,w,h,c)},
    text:(id,text,x,y,size,color)=>{const width=Math.max(80,ui.width-x-12);const label=ui.text(id,text,x+width/2-ui.width/2,ui.height/2-y,size,color,width);label.horizontalAlign=0;},
    button:b=>{ui.button(b.id,b.label,b.x+b.w/2-ui.width/2,ui.height/2-b.y-b.h/2,b.w,()=>{if(!b.disabled)panel.action(b.id)},!b.disabled,b.h);}
  },ui.width,ui.height,false,Math.max(ui.insets.top,ui.insets.menuBottom),ui.insets.bottom+10);
  ui.platform.state('menu');ui.end({phase:'menu',career:{coins:panel.career.data.coins,tab:panel.tab,skin:panel.career.data.skin,upgrades:panel.career.data.upgrades}});
}
