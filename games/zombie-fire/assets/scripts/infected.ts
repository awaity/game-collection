import {Color,Graphics} from 'cc';
import {enemyById} from './content';
import type {Enemy} from './core';

const swatches=new Map<string,Color>();
const paint=(hex:string)=>{let c=swatches.get(hex);if(!c){c=new Color().fromHEX(hex);swatches.set(hex,c);}return c;};
const ink='#172029';
/** Original comic silhouettes. Curves, clothing and equipment are authored here. */
export class InfectedPainter {
 private x=0;private y=0;private scale=1;
 constructor(private g:Graphics){}
 private poly(points:number[][],fill:string,outline=ink,width=1.2){const g=this.g;g.fillColor=paint(fill);g.strokeColor=paint(outline);g.lineWidth=width*this.scale;points.forEach(([x,y],i)=>i?g.lineTo(this.x+x*this.scale,this.y+y*this.scale):g.moveTo(this.x+x*this.scale,this.y+y*this.scale));g.close();g.fill();if(width)g.stroke();}
 private line(points:number[][],tint=ink,width=1){const g=this.g;g.strokeColor=paint(tint);g.lineWidth=width*this.scale;points.forEach(([x,y],i)=>i?g.lineTo(this.x+x*this.scale,this.y+y*this.scale):g.moveTo(this.x+x*this.scale,this.y+y*this.scale));g.stroke();}
 private oval(x:number,y:number,rx:number,ry:number,fill:string,outline='',width=1){const g=this.g;g.fillColor=paint(fill);g.ellipse(this.x+x*this.scale,this.y+y*this.scale,rx*this.scale,ry*this.scale);g.fill();if(outline){g.strokeColor=paint(outline);g.lineWidth=width*this.scale;g.stroke();}}
 private curve(points:number[][],fill:string,outline=ink){const g=this.g,p=points.map(([x,y])=>[this.x+x*this.scale,this.y+y*this.scale]);g.fillColor=paint(fill);g.strokeColor=paint(outline);g.lineWidth=1.3*this.scale;g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i+=3)g.bezierCurveTo(p[i][0],p[i][1],p[i+1][0],p[i+1][1],p[i+2][0],p[i+2][1]);g.close();g.fill();g.stroke();}
 draw(e:Enemy,x:number,y:number,scale:number,motion:boolean,detail:boolean){
  this.x=x;this.y=y;this.scale=scale;
  const kind=e.kind,skin=enemyById[kind].color,walk=motion&&e.freeze<=0&&e.stun<=0&&e.root<=0?Math.sin(e.age*(kind==='runner'?14:8))*2:0;
  const metal=kind==='armor'||kind==='mech',heavy=kind==='brute'||kind==='butcher',doctor=kind==='healer',mutant=kind==='splitter'||kind==='queen';
  this.oval(0,-21,heavy?18:14,4.5,'#17202945');
  if(kind==='mech'){this.mech(walk);return;}
  if(kind==='bat'){
   const flap=motion?Math.sin(e.age*13)*4:0;
   for(const side of [-1,1]){this.poly([[side*5,13],[side*18,25+flap],[side*32,16+flap],[side*23,12],[side*20,1],[side*13,6],[side*8,-1]],'#7e6b92');this.line([[side*6,10],[side*18,21+flap],[side*20,2]],'#b3a0bd',1);}
  }else{
   for(const side of [-1,1]){
    const stride=walk*side;
    this.poly([[side*2,-7],[side*10,-5],[side*11,-17+stride],[side*4,-20+stride]],'#35454f');
    this.poly([[side*4,-16+stride],[side*12,-16+stride],[side*15,-22+stride],[side*3,-22+stride]],'#253039');
    this.line([[side*5,-19+stride],[side*11,-19+stride]],'#78817c');
   }
  }
  if(mutant)for(const side of [-1,1]){this.curve([[side*8,-6],[side*30,-4],[side*23,17],[side*10,16],[side*15,10],[side*17,2],[side*8,-6]],kind==='queen'?'#86687e':'#708f79');this.oval(side*18,9,4,5,'#c2c696',ink);}
  const coat=metal?'#65727b':doctor?'#d0d3c0':kind==='runner'?'#99775e':kind==='bomber'?'#927443':kind==='fireguard'?'#a7593f':kind==='frostguard'?'#829da9':kind==='shockguard'?'#b6a45d':kind==='burrower'?'#7e7465':kind==='queen'?'#755a79':'#637c76';
  for(const side of [-1,1]){
   const reach=walk*side;
   this.curve([[side*9,10],[side*16,11],[side*17,4+reach],[side*16,-1+reach],[side*15,-5+reach],[side*10,-3],[side*9,10]],coat);
   this.poly([[side*12,0+reach],[side*17,-1+reach],[side*20,-8+reach],[side*16,-11+reach],[side*12,-7+reach]],skin);
   if(detail)this.line([[side*16,-6+reach],[side*18,-8+reach]],'#4d6257');
  }
  this.curve([[-10,11],[-15,5],[-15,-7],[-10,-12],[-3,-16],[7,-15],[12,-10],[15,-3],[13,6],[9,11],[3,14],[-5,14],[-10,11]],coat);
  this.poly([[-8,10],[-1,4],[6,10],[6,-3],[1,-8],[-7,-5]],heavy?'#9eaa83':'#a4b2a0');
  this.poly([[-10,10],[-4,6],[-6,1],[-1,-2],[-5,-11],[-13,-7]],coat);
  this.line([[9,8],[7,2],[11,-6]],'#344944');
  this.poly([[-12,-8],[-6,-9],[-5,-13],[1,-10],[6,-13],[12,-8],[10,-14],[-9,-15]],'#3b4d48');
  if(detail){this.line([[-9,2],[-5,1]],'#aebcad');this.line([[7,-2],[11,-1]],'#b1b5a4');this.poly([[-2,-10],[2,-10],[2,-13],[-2,-13]],'#d0b281',ink,.7);}
  if(metal){this.poly([[-12,10],[-7,14],[0,10],[7,14],[12,10],[9,-5],[0,-10],[-9,-5]],'#536372');this.line([[-7,9],[-6,-2],[0,-5],[6,-2],[7,9]],'#a4b1b7',1.8);}
  if(kind==='bomber')for(const dx of [-7,0,7]){this.poly([[dx-2,3],[dx+2,3],[dx+2,-8],[dx-2,-8]],'#a34e3d');this.line([[dx,4],[dx+2,8],[4,9]],'#e7c173');}
  if(kind==='shockguard'){this.poly([[-12,11],[-8,16],[10,14],[14,7],[8,3],[-7,4]],'#d0b861');this.line([[-9,9],[10,8]],'#6b6744',2);this.poly([[1,2],[-3,-4],[1,-4],[-1,-9],[5,-2],[2,-2]],'#eee2a1',ink,.7);}
  if(kind==='burrower'){this.poly([[-20,-10],[-12,-2],[-10,-4],[-15,-14],[-24,-17]],'#a6a093');this.line([[14,-10],[24,19]],'#665447',2.5);this.poly([[17,17],[20,25],[26,27],[29,22],[24,16]],'#a0a9a2');}
  if(kind==='spitter'){this.curve([[-10,6],[-21,12],[-22,-4],[-14,-8],[-9,-9],[-7,-1],[-10,6]],'#78984a');this.oval(-16,2,3,4,'#c7db6f');}
  // Uneven jaw and brow create a different face from the player's helmeted soldier.
  this.oval(-11,15,3,4,skin,ink);this.oval(11,15,3,4,skin,ink);
  this.curve([[-9,25],[-3,30],[9,29],[12,21],[15,13],[11,5],[5,2],[-1,0],[-8,3],[-10,8],[-13,14],[-13,21],[-9,25]],skin);
  this.poly([[6,25],[10,22],[11,14],[8,9],[7,3],[3,2],[5,10]],'#617b6c','#617b6c',0);
  this.poly([[-11,21],[-12,27],[-6,26],[-4,30],[1,26],[5,29],[10,25],[11,20],[6,23],[2,20],[-4,24]],kind==='fireguard'?'#533d35':'#344444');
  this.oval(-5,16,4.2,3.9,'#33483f');this.oval(5,16,4.1,3.9,'#33483f');
  this.oval(-4.7,16.2,2.6,2.3,kind==='frostguard'?'#caf5f4':'#e6db9f');this.oval(5,16.1,2.6,2.3,kind==='frostguard'?'#caf5f4':'#e6db9f');
  this.oval(-4,15.8,.9,1.4,ink);this.oval(4.6,15.7,.9,1.4,ink);
  this.line([[-9,20],[-2,18]],ink,1.5);this.line([[2,18],[9,20]],ink,1.5);
  this.poly([[-6,8],[-1,10],[6,8],[4,3],[-4,4]],'#33443c',ink,.7);
  this.poly([[-4,8],[-1,8],[-1,6],[-4,6]],'#ece1ba',ink,.4);this.poly([[1,7],[4,7],[3,5],[1,5]],'#ece1ba',ink,.4);
  if(detail){this.line([[0,15],[-1,11],[1,11]],'#4a6558');this.line([[-8,12],[-5,11]],'#667d6c');this.line([[6,24],[7,21]],'#b9c2a0');}
  if(doctor){this.poly([[-10,26],[-8,33],[8,33],[11,26]],'#dfe1cb');this.line([[0,27],[0,32]],'#a85042',2);this.line([[-3,29.5],[3,29.5]],'#a85042',2);}
  if(kind==='armor'||kind==='shield'){this.curve([[-13,21],[-15,34],[14,35],[14,22],[7,20],[-7,22],[-13,21]],'#6a7882');this.line([[-10,25],[10,25]],'#abb6b5',1.5);}
  if(kind==='shield'){this.poly([[-19,13],[-5,16],[0,10],[-1,-9],[-10,-15],[-20,-8]],e.shield>0?'#6d8793':'#4c5e63');this.poly([[-16,10],[-6,11],[-4,-5],[-10,-10],[-17,-5]],'#374e5b');this.line([[-15,7],[-7,8]],e.shield>0?'#afdbde':'#6c777b',2);}
  if(kind==='butcher'){this.line([[18,-8],[23,19]],'#3e4140',3);this.poly([[21,19],[25,30],[39,23],[35,10],[24,13]],'#b3b6a3');this.line([[25,15],[34,13]],'#e0dcc2',2);this.poly([[-11,1],[0,-3],[10,2],[9,-12],[-9,-12]],'#856c53');}
  if(mutant)for(const [dx,dy,r] of [[-6,29,4],[2,31,5],[10,26,3]])this.oval(dx,dy,r,r*.8,kind==='queen'?'#c3a0c0':'#c3cd9b',ink);
  if(kind==='queen')for(const side of [-1,1])this.poly([[side*8,24],[side*15,38],[side*20,33],[side*12,18]],'#aa7b9f');
  if(kind==='fireguard')for(const side of [-1,1])this.poly([[side*9,22],[side*16,29],[side*12,31],[side*16,39],[side*6,30]],'#e8a052','#873f2e');
  if(kind==='frostguard')for(const side of [-1,1])this.poly([[side*10,7],[side*21,14],[side*15,27],[side*13,13]],'#b7dfeb','#5b8b9c');
 }
 private mech(walk:number){
  for(const side of [-1,1]){this.poly([[side*9,-2],[side*22,-3],[side*24,-21+walk*side],[side*9,-20]],'#344653');this.line([[side*13,-6],[side*20,-6],[side*21,-16]],'#8b9595',2);}
  this.poly([[-21,15],[-13,24],[14,24],[23,15],[20,-9],[8,-15],[-11,-15],[-21,-8]],'#8b958e');
  this.poly([[-16,13],[-10,19],[10,19],[17,12],[13,-5],[-13,-5]],'#3c5360');
  this.poly([[-13,11],[13,11],[9,1],[-9,1]],'#c3e1df');this.line([[-10,7],[10,7]],'#71b2ca',3);
  this.poly([[-9,25],[-5,32],[9,31],[12,23]],'#b6beb0');
  this.poly([[-25,11],[-35,5],[-31,-16],[-22,-9]],'#566c78');
  this.poly([[22,12],[31,8],[39,-23],[23,-8]],'#abb9b6');for(let n=0;n<4;n++)this.line([[24+n*2,6-n*6],[32+n*1.5,2-n*6]],'#4c626e',1.5);
  for(const side of [-1,1])this.oval(side*16,15,2,2,'#d6d8bf',ink);
  this.poly([[-10,-7],[10,-7],[8,-12],[-8,-12]],'#e5b86f');
 }
}
