import {Graphics} from 'cc';
import {color} from 'db://assets/collection/runtime';
import {SKINS} from './profile';

function painter(g:Graphics,x:number,y:number,scale=1){
 const point=([px,py]:number[])=>[x+px*scale,y+py*scale];
 const poly=(points:number[][],fill:string,stroke='#1d2b33',width=1.5)=>{g.fillColor=color(fill);g.strokeColor=color(stroke);g.lineWidth=width*scale;points.map(point).forEach(([px,py],i)=>i?g.lineTo(px,py):g.moveTo(px,py));g.close();g.fill();if(width)g.stroke();};
 const line=(points:number[][],tint:string,width=2)=>{g.strokeColor=color(tint);g.lineWidth=width*scale;points.map(point).forEach(([px,py],i)=>i?g.lineTo(px,py):g.moveTo(px,py));g.stroke();};
 const ellipse=(px:number,py:number,rx:number,ry:number,fill:string)=>{g.fillColor=color(fill);g.ellipse(x+px*scale,y+py*scale,rx*scale,ry*scale);g.fill();};
 const rect=(px:number,py:number,w:number,h:number,fill:string)=>poly([[px-w/2,py-h/2],[px+w/2,py-h/2],[px+w/2,py+h/2],[px-w/2,py+h/2]],fill);
 return {poly,line,ellipse,rect};
}

export function drawSoldier(g:Graphics,skinId:string,x:number,y:number,scale:number){
 const skin=SKINS.find(s=>s.id===skinId)??SKINS[0],{poly,line,ellipse,rect}=painter(g,x,y,scale),c=skin.color,accent=skin.accent;
 ellipse(0,-39,31,8,'#12212d66');
 if(skinId==='arctic')poly([[-17,11],[-28,-35],[-3,-29],[24,-37],[16,13]],'#b6d7dd');
 if(skinId==='arc'){for(const side of [-1,1]){poly([[side*13,12],[side*32,4],[side*25,-22],[side*8,-9]],'#72577f');line([[side*21,8],[side*28,-2],[side*19,-18]],accent,2);}}
 poly([[-16,-12],[-2,-15],[-5,-34],[-18,-34]],'#384c58');poly([[2,-15],[16,-12],[18,-34],[5,-34]],'#384c58');
 poly([[-18,-29],[-5,-29],[-3,-40],[-23,-40],[-24,-36]],'#26363e');poly([[5,-29],[18,-29],[24,-36],[23,-40],[3,-40]],'#26363e');
 line([[-17,-31],[-8,-31]],'#94a6a8',2);line([[8,-31],[17,-31]],'#94a6a8',2);
 poly([[-17,14],[-25,1],[-19,-9],[-12,-7],[-11,10]],c);poly([[17,14],[25,1],[19,-9],[12,-7],[11,10]],c);
 poly([[-14,16],[13,16],[17,-16],[8,-22],[-11,-20],[-17,-12]],c);
 poly([[-12,13],[-3,8],[3,8],[13,13],[11,-5],[0,-9],[-11,-5]],'#364b57');
 poly([[-11,11],[-4,7],[-4,-4],[-11,-2]],'#8c9a9a');poly([[11,11],[4,7],[4,-4],[11,-2]],'#657e86');
 rect(0,-12,29,6,'#263c49');rect(0,-12,7,6,accent);rect(-9,-7,5,6,'#b39f72');rect(9,-7,5,6,'#b39f72');
 ellipse(-16,-7,5,6,'#b99575');ellipse(16,-7,5,6,'#b99575');
 poly([[-10,35],[-13,26],[-10,17],[-4,13],[5,13],[12,20],[12,32],[5,39]],'#d7b292');
 poly([[5,35],[10,31],[10,21],[4,17],[2,22]],'#b68e73','#b68e73',0);
 line([[-9,26],[-3,27]],'#31414b',2);line([[3,27],[9,26]],'#31414b',2);line([[-3,19],[5,19]],'#8d6554',1);
 poly([[-14,28],[-13,39],[-7,46],[7,46],[14,38],[14,28],[9,32],[6,36],[-9,33]],c);
 poly([[-11,38],[-6,44],[5,44],[9,40],[2,39]],'#b1bdba','#354651',1);rect(0,40,6,6,accent);
 if(skinId==='ranger'){poly([[-12,30],[11,30],[12,27],[-9,26]],'#34444d');line([[-8,25],[-3,25]],'#e3cfad',1);}
 if(skinId==='ember'){poly([[-16,41],[-15,28],[-9,24],[-10,38]],'#a4493b');poly([[16,41],[15,28],[9,24],[10,38]],'#a4493b');rect(0,28,22,7,'#352f38');line([[-9,29],[8,29]],'#ffbe57',2);for(const side of [-1,1]){poly([[side*13,15],[side*25,16],[side*25,6],[side*16,4]],'#b1573b');line([[side*18,14],[side*22,8]],accent,2);}}
 if(skinId==='arctic'){poly([[-16,29],[-17,40],[-7,50],[8,50],[17,39],[15,25],[10,30],[12,37],[5,43],[-6,43],[-12,37],[-10,27]],'#d6e3e3');rect(0,28,24,7,'#42616e');line([[-9,29],[9,29]],accent,2);poly([[-12,18],[0,13],[12,18],[10,9],[0,5],[-11,11]],'#b9dcdf');}
 if(skinId==='hazard'){poly([[-12,23],[-8,15],[8,15],[12,23],[5,26],[-5,26]],'#4c5c54');ellipse(-7,20,4,4,accent);ellipse(7,20,4,4,accent);line([[-11,38],[-8,45],[7,45]],'#eadb8a',3);line([[10,19],[18,15],[18,-1]],'#283b3a',4);}
 if(skinId==='arc'){poly([[-13,37],[-19,48],[-9,42],[-3,44],[3,44],[10,42],[20,48],[13,35]],'#8c73a8');rect(0,29,22,6,'#304357');line([[-9,29],[9,29]],accent,2);poly([[0,3],[-4,-2],[0,-6],[4,-2]],accent);}
 // Angled rifle: stock, receiver, sight and muzzle are separate silhouettes.
 poly([[-23,-5],[-17,-11],[18,18],[15,23],[-10,3],[-9,-6],[-16,-11]],'#273843');
 line([[-7,4],[16,24]],'#83979e',5);line([[14,23],[24,33]],'#293943',5);line([[14,24],[23,32]],accent,1.5);rect(-4,0,5,9,'#596a72');
}

export function drawCamp(g:Graphics,width:number,height:number,skin:string,mapColor:string){
 g.clear();const scale=Math.min(width/330,height/270),{poly,line,ellipse,rect}=painter(g,0,-15*scale,scale);
 ellipse(0,-67,150,33,'#1b2a3555');
 poly([[-150,-29],[-40,-93],[148,-17],[37,44]],'#344b58','#c2995d',2);
 for(let i=0;i<10;i++){line([[-143+i*20,-25-i*7],[40+i*10,40-i*8]],'#b58a5055',1);}
 const block=(x:number,y:number,w:number,d:number,h:number)=>{
  poly([[x-w/2,y],[x+w/2,y],[x+w/2,y+h],[x-w/2,y+h]],'#617984');
  poly([[x+w/2,y],[x+w/2+d/2,y+d/3],[x+w/2+d/2,y+h+d/3],[x+w/2,y+h]],'#344c60');
  poly([[x-w/2,y+h],[x-w/2+d/2,y+h+d/3],[x+w/2+d/2,y+h+d/3],[x+w/2,y+h]],'#9eafb1');
  line([[x-w/2+3,y+h-3],[x+w/2-2,y+h-3]],'#d4d3bd',2);
 };
 block(-90,-20,59,45,111);block(73,0,53,45,127);block(-5,-30,113,42,52);
 rect(-90,45,42,35,'#2a455a');line([[-109,44],[-73,44]],'#8fd8dc',2);rect(-90,74,36,9,mapColor);
 rect(73,71,33,49,'#2c4658');line([[60,60],[86,60]],'#9cb7bc',2);line([[60,75],[86,75]],'#9cb7bc',2);rect(72,112,27,7,mapColor);
 poly([[-36,-29],[-36,9],[20,9],[20,-29]],'#223846');for(let i=0;i<7;i++)line([[-33+i*8,-27],[-33+i*8,7]],'#617782',2);
 rect(-6,18,108,8,'#344652');for(let i=0;i<10;i++)poly([[-56+i*11,15],[-50+i*11,15],[-44+i*11,21],[-50+i*11,21]],'#d6a45c','#d6a45c',0);
 block(98,-40,40,30,18);ellipse(104,-14,14,6,'#d0a764');line([[97,-17],[107,-11]],'#3c525b',2);line([[100,-10],[108,-16]],'#3c525b',2);
 block(-101,-61,31,22,25);line([[-113,-59],[-90,-38]],'#a4a99b',2);line([[-90,-59],[-113,-38]],'#a4a99b',2);
 line([[-107,93],[-107,140]],'#bfc5b4',3);poly([[-106,140],[-69,135],[-79,119],[-106,123]],mapColor);line([[-100,132],[-86,130]],'#e8dabc',2);
 for(const x of [-68,54]){rect(x,-26,11,27,'#3d525c');ellipse(x,-11,3,3,'#d7d491');}
 drawSoldier(g,skin,11*scale,-47*scale,scale*1.25);
}

export function drawDrone(g:Graphics,x:number,y:number,size:number,time:number){
 const {poly,line,ellipse}=painter(g,x,y,size/18);
 ellipse(0,-9,14,4,'#17202933');
 for(const side of [-1,1]){
  line([[side*3,2],[side*12,10]],'#1f303b',4);
  ellipse(side*12,10,8,3,'#c9d7cd66');
  const spin=Math.sin(time*30)*2;
  line([[side*12-6,10+spin],[side*12+6,10-spin]],'#a7c2c8',1.4);
  ellipse(side*12,10,2.2,2.2,'#304d5a');
 }
 poly([[-6,8],[0,14],[6,8],[7,-7],[0,-11],[-7,-7]],'#d8ded0');
 poly([[-4,7],[0,11],[4,7],[3,-2],[-3,-2]],'#546f7a');
 line([[-3,-5],[3,-5]],'#efae5d',2);ellipse(0,2,1.6,1.6,'#a8edf1');
}

export function drawDragon(g:Graphics,x:number,y:number,scale:number,time:number,attacking:boolean){
 const {poly,line,ellipse}=painter(g,x,y,scale),claw=attacking?5:0;
 ellipse(0,-17,31,9,'#17202944');
 poly([[-5,-7],[-17,-15],[-23,-10],[-26,-15],[-17,-24],[5,-14]],'#597b88');
 for(const side of [-1,1]){
  poly([[side*7,6],[side*17,20],[side*33,11],[side*22,4],[side*26,-4],[side*11,-3]],'#7fa7b5');
  poly([[side*15,12],[side*29,11],[side*20,6]],'#c0e4e7');
  poly([[side*8,-4],[side*18,-7],[side*21,-15+claw],[side*11,-16+claw],[side*9,-10]],'#a4c6ce');
  for(let n=0;n<3;n++)line([[side*(12+n*3),-13+claw],[side*(13+n*3),-19+claw]],'#e2f6ed',1.8);
 }
 poly([[-10,10],[-7,-13],[0,-18],[9,-11],[11,11],[0,20]],'#54808f');
 poly([[-6,10],[-4,-8],[0,-13],[5,-8],[7,11],[0,15]],'#b5dce0');
 for(let n=0;n<3;n++)line([[-4,7-n*6],[5,7-n*6]],'#5b8a9d',1.4);
 for(const side of [-1,1])poly([[side*6,17],[side*16,30],[side*11,31],[side*4,24]],'#d1edf0');
 poly([[-10,22],[-12,13],[-7,6],[0,3],[9,7],[12,16],[8,24],[0,28]],'#86b9c9');
 poly([[-8,20],[0,24],[8,20],[5,14],[-5,14]],'#c8edf0');
 poly([[-10,17],[-3,15],[-4,12],[-9,13]],'#223f57');poly([[10,17],[3,15],[4,12],[9,13]],'#223f57');
 line([[-8,15],[-4,14]],'#72e6fa',1.5);line([[4,14],[8,15]],'#72e6fa',1.5);
 poly([[-7,8],[0,4],[7,8],[5,1],[-4,1]],'#5c8b9e');line([[-4,4],[4,4]],'#e6f5e6');
 if(attacking)for(const side of [-1,1])for(let n=0;n<3;n++)line([[side*(15+n*4),13],[side*(18+n*4),5],[side*(16+n*4),-4]],'#b5eff4',1.8);
 else ellipse(0,-6,2.5,3,'#71dbe9');
}
