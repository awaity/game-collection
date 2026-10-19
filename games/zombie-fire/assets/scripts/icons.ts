import {Graphics} from 'cc';
import {color} from 'db://assets/collection/runtime';
import {skillById,type SkillId} from './content';

/** Original vector weapon emblems, shared by upgrade cards, HUD and research. */
export function skillIcon(g:Graphics,id:SkillId,size:number,seal=false){
 const scale=size/48,c=skillById[id].color,ink='#293943';
 const line=(points:number[][],tint=c,width=3)=>{g.strokeColor=color(tint);g.lineWidth=width*scale;points.forEach(([x,y],i)=>i?g.lineTo(x*scale,y*scale):g.moveTo(x*scale,y*scale));g.stroke();};
 const poly=(points:number[][],tint=c)=>{g.fillColor=color(tint);points.forEach(([x,y],i)=>i?g.lineTo(x*scale,y*scale):g.moveTo(x*scale,y*scale));g.close();g.fill();};
 const circle=(x:number,y:number,r:number,tint=c)=>{g.fillColor=color(tint);g.circle(x*scale,y*scale,r*scale);g.fill();};
 g.clear();
 if(seal){const gear=Array.from({length:48},(_,i)=>{const angle=i*Math.PI/24,r=i%4<2?23:20;return [Math.cos(angle)*r,Math.sin(angle)*r];});poly(gear,'#756c57');circle(0,0,18,'#33464e');}
 else {g.fillColor=color('#33464e');g.roundRect(-size/2,-size/2,size,size,6);g.fill();}
 if(id==='rifle'){poly([[-16,-4],[10,9],[14,5],[0,-5],[-2,-15],[-7,-16],[-7,-9],[-13,-12]]);line([[8,7],[18,13]],c,4);}
 if(id==='thermo'||id==='fuel'){poly([[-12,-9],[-16,1],[-5,19],[-5,7],[4,14],[14,1],[10,-12],[0,-17]]);poly([[-5,-9],[-6,-3],[0,7],[6,-3],[3,-11]],'#ffe6a0');if(id==='fuel')line([[-16,-18],[16,-18]],c,3);}
 if(id==='dryice'||id==='frost'){for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a),y=Math.sin(a);line([[0,0],[x*17,y*17]],c,2);line([[x*10-y*5,y*10+x*5],[x*12,y*12],[x*10+y*5,y*10-x*5]],c,2);}circle(0,0,3,'#ebffff');if(id==='frost')line([[-17,-20],[17,-20]],c,2);}
 if(id==='electro'||id==='electron'){poly([[2,19],[-12,-1],[-2,-1],[-6,-20],[14,4],[4,4],[9,19]]);if(id==='electron'){circle(-16,12,3);circle(16,-10,3);line([[-16,8],[-19,0],[-14,-9]],c,1.5);}}
 if(id==='guided'||id==='ray'){line([[-17,-17],[17,17]],c,id==='ray'?7:3);line([[-15,-17],[17,15]],'#f8edca',1);if(id==='guided'){g.strokeColor=color(c);g.lineWidth=2*scale;g.circle(9*scale,9*scale,9*scale);g.stroke();}else{line([[-15,6],[-8,13]],c,2);line([[5,-15],[13,-7]],c,2);}}
 if(id==='cyclone'){for(let i=0;i<4;i++)line([[-17+i*3,14-i*9],[10-i,18-i*9],[17-i*3,13-i*9],[-7+i,9-i*9]],c,2.5);}
 if(id==='blade'){poly([[-18,-11],[-7,12],[13,18],[1,6],[18,-7],[4,-4],[-9,-17],[-6,-2]]);line([[-10,-19],[14,6]],'#f6f7d5',1.5);}
 if(id==='vehicle'){poly([[-16,-16],[-16,14],[16,14],[16,-16]]);line([[-13,-14],[-13,12]],ink,4);line([[13,-14],[13,12]],ink,4);circle(0,0,8,'#5c7466');line([[0,0],[0,22]],c,5);}
 if(id==='airdrop'){poly([[-18,2],[-15,13],[0,20],[15,13],[18,2]]);line([[-17,2],[-6,-14],[6,-14],[17,2]],c,1.5);poly([[-7,-12],[7,-12],[7,-20],[-7,-20]],'#e2c989');}
 if(id==='drone'){for(const side of [-1,1]){line([[0,0],[side*13,11]],c,3);g.strokeColor=color(c);g.lineWidth=2*scale;g.ellipse(side*13*scale,11*scale,8*scale,4*scale);g.stroke();}poly([[-6,6],[0,12],[6,6],[6,-12],[0,-17],[-6,-12]]);line([[-3,-7],[3,-7]],'#f0ac5d',2);}
 if(id==='rift'){poly([[-19,0],[0,21],[19,0],[0,-21]],'#75639f');line([[-19,0],[0,21],[19,0],[0,-21],[-19,0]],c,2);poly([[-6,0],[1,14],[4,2],[1,-14]],'#ebddff');}
 if(id==='matrix'){for(const [x,y]of [[-10,4],[9,6],[0,-8]]){circle(x,y,10,'#6c8a4d');g.strokeColor=color(c);g.lineWidth=1.5*scale;g.circle(x*scale,y*scale,10*scale);g.stroke();}line([[0,6],[5,3],[5,-3],[0,-6],[-5,-3],[-5,3],[0,6]],'#e0edbc',2);}
 if(id==='dragon'){poly([[-13,12],[-18,21],[-9,18],[0,14],[10,18],[18,21],[13,9],[14,0],[7,-14],[0,-19],[-7,-13],[-14,0]],c);poly([[-9,7],[-2,4],[-5,0],[-10,2]],ink);poly([[9,7],[2,4],[5,0],[10,2]],ink);line([[-5,-9],[5,-9]],'#efffff',2);}
}
