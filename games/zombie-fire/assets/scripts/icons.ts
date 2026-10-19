import {Graphics} from 'cc';
import {color} from 'db://assets/collection/runtime';
import {skillById,type SkillId} from './content';

/** Original vector weapon emblems, shared by upgrade cards, HUD and research. */
export function skillIcon(g:Graphics,id:SkillId,size:number){
 const scale=size/48,c=skillById[id].color,ink='#293943';
 const line=(points:number[][],tint=c,width=3)=>{g.strokeColor=color(tint);g.lineWidth=width*scale;points.forEach(([x,y],i)=>i?g.lineTo(x*scale,y*scale):g.moveTo(x*scale,y*scale));g.stroke();};
 const poly=(points:number[][],tint=c)=>{g.fillColor=color(tint);points.forEach(([x,y],i)=>i?g.lineTo(x*scale,y*scale):g.moveTo(x*scale,y*scale));g.close();g.fill();};
 const circle=(x:number,y:number,r:number,tint=c)=>{g.fillColor=color(tint);g.circle(x*scale,y*scale,r*scale);g.fill();};
 g.clear();g.fillColor=color('#33464e');g.roundRect(-size/2,-size/2,size,size,6);g.fill();
 if(id==='rifle'){poly([[-16,-4],[10,9],[14,5],[0,-5],[-2,-15],[-7,-16],[-7,-9],[-13,-12]]);line([[8,7],[18,13]],c,4);}
 if(id==='thermo'||id==='fuel'){poly([[-12,-9],[-16,1],[-5,19],[-5,7],[4,14],[14,1],[10,-12],[0,-17]]);poly([[-5,-9],[-6,-3],[0,7],[6,-3],[3,-11]],'#ffe6a0');if(id==='fuel')line([[-16,-18],[16,-18]],c,3);}
 if(id==='dryice'||id==='frost'){for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a),y=Math.sin(a);line([[0,0],[x*17,y*17]],c,2);line([[x*10-y*5,y*10+x*5],[x*12,y*12],[x*10+y*5,y*10-x*5]],c,2);}circle(0,0,3,'#ebffff');if(id==='frost')line([[-17,-20],[17,-20]],c,2);}
 if(id==='electro'||id==='electron'){poly([[2,19],[-12,-1],[-2,-1],[-6,-20],[14,4],[4,4],[9,19]]);if(id==='electron'){circle(-16,12,3);circle(16,-10,3);line([[-16,8],[-19,0],[-14,-9]],c,1.5);}}
 if(id==='guided'||id==='ray'){line([[-17,-17],[17,17]],c,id==='ray'?7:3);line([[-15,-17],[17,15]],'#f8edca',1);if(id==='guided'){g.strokeColor=color(c);g.lineWidth=2*scale;g.circle(9*scale,9*scale,9*scale);g.stroke();}else{line([[-15,6],[-8,13]],c,2);line([[5,-15],[13,-7]],c,2);}}
 if(id==='cyclone'){for(let i=0;i<4;i++)line([[-17+i*3,14-i*9],[10-i,18-i*9],[17-i*3,13-i*9],[-7+i,9-i*9]],c,2.5);}
 if(id==='blade'){poly([[-18,-11],[-7,12],[13,18],[1,6],[18,-7],[4,-4],[-9,-17],[-6,-2]]);line([[-10,-19],[14,6]],'#f6f7d5',1.5);}
 if(id==='vehicle'){poly([[-16,-16],[-16,14],[16,14],[16,-16]]);line([[-13,-14],[-13,12]],ink,4);line([[13,-14],[13,12]],ink,4);circle(0,0,8,'#5c7466');line([[0,0],[0,22]],c,5);}
 if(id==='airdrop'){poly([[-18,2],[-15,13],[0,20],[15,13],[18,2]]);line([[-17,2],[-6,-14],[6,-14],[17,2]],c,1.5);poly([[-7,-12],[7,-12],[7,-20],[-7,-20]],'#e2c989');}
}
