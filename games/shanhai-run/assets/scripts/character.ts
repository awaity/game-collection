import {Geometry} from './geometry';
import {Run} from './core';
import {SKINS} from './profile';
type Skin=typeof SKINS[number];
type Point=[number,number,number];
const gold='#e9c27c',hair='#182d34',skinTone='#f1c9a8';

function feather(g:Geometry,x:number,y:number,z:number,length:number,tint:string,angle:number){
  g.at(x,y,z,1,1,1,-18,0,angle,()=>{
    g.quad([0,0,0],[-.15,length*.45,.04],[0,length,.12],[.17,length*.43,.04],tint);
    g.quad([0,.03,-.01],[-.05,length*.48,.02],[0,length*.92,.11],[.05,length*.48,.02],gold);
    for(let n=1;n<5;n++)g.box(0,length*n/6,.04,.23*(1-n/6),.012,.015,'#ffffff',0,0,n%2?12:-12);
  });
}

/** Original articulated costume geometry; same silhouette in all three targets. */
export function character(g:Geometry,skin:Skin,time:number,run:Run,preview:boolean,reduced=false){
  const moving=!preview&&run.phase==='running',stride=moving?Math.sin(time*17):0,jump=!preview&&run.jumpAge>=0,slide=!preview&&run.sliding;
  const dying=!preview&&(run.phase==='dying'||run.phase==='dead'),fall=dying&&run.deathKind==='fall',wind=!preview&&run.wind>0;
  const height=preview?0:fall?-Math.min(8,run.deathTime**2*9):run.height+(wind?.65:run.landing/.25*.65);
  const lean=wind?-20:slide?-65:dying?Math.min(75,run.deathTime*95):jump?9:moving?4:0;
  const t=reduced?0:time,breathe=preview&&!reduced?Math.sin(t*2)*.016:0;
  g.at(0,height+(slide?.28:0)+breathe,0,1,slide?.82:1,1,lean,preview?172+Math.sin(t*.6)*8:0,(run.targetLane-run.x)*-8,()=>{
    // Boots, knee wraps, trousers. Upper and lower limbs have separate articulation.
    for(const side of [-1,1])g.at(side*.16,.73,0,1,1,1,jump?side*24:slide?side*12:stride*side*32,0,0,()=>{
      g.cone(0,-.18,0,.115,.10,.38,'#233840',10);
      g.at(0,-.36,0,1,1,1,jump?-35:Math.max(0,-stride*side)*24,0,0,()=>{
        g.cone(0,-.16,.015,.105,.09,.34,skin.color,10);g.cone(0,-.16,.015,.113,.10,.08,skin.accent,10);
        g.sphere(0,-.36,-.075,.23,.17,.37,'#1d3038',5,10);g.box(0,-.40,-.10,.23,.045,.38,gold);
        g.box(0,-.31,-.18,.14,.06,.12,skin.accent,12);g.box(0,-.12,-.095,.04,.27,.025,gold);
      });
    });
    // Tailored torso and a layered, split robe with visible edging.
    g.cone(0,1.12,0,.255,.29,.65,skin.color,12);g.cone(0,.76,0,.29,.35,.18,skin.color,12);
    for(const side of [-1,1]){
      const swing=Math.sin(t*7+side)*.045+(moving?.045:0);
      g.ribbon([[side*.18,.91,.03],[side*.22,.64,.10],[side*.27,.30,.16+swing],[side*.31,.19,.23+swing]],[.30,.35,.30,.19],skin.color);
      g.ribbon([[side*.31,.84,-.03],[side*.40,.57,.03],[side*.43,.27,.12+swing]],[.028,.035,.025],gold);
      g.quad([side*.025,1.44,-.19],[side*.25,1.35,-.20],[side*.05,.97,-.29],[-side*.08,1.08,-.27],skin.form==='traveler'?'#c4e0cf':skin.accent);
      g.ribbon([[side*.05,1.43,-.211],[side*.15,1.26,-.241],[-side*.07,1.05,-.292]],[.025,.027,.022],gold);
      g.sphere(side*.27,1.40,.015,.23,.15,.39,skin.accent,4,10);
      for(let n=0;n<3;n++)g.cone(side*.26,1.37-n*.045,0,.14,.16,.035,gold,10,0,0,side*18);
    }
    g.cone(0,.92,0,.303,.31,.12,'#28383f',12);g.cone(0,.96,0,.31,.31,.035,gold,12);g.cone(0,.87,0,.32,.32,.026,gold,12);
    g.box(0,.92,-.31,.16,.13,.04,gold,0,0,45);g.sphere(0,.92,-.35,.085,.09,.025,'#70cfb1',4,8);
    g.sweep([[-.22,.91,-.2],[-.32,.73,-.23],[-.25,.57,-.24]],[.018,.018,.012],gold,6);g.sphere(-.25,.53,-.24,.10,.16,.05,'#79bcab',5,8);
    // Neck, ears, brows, eyelids, nose and lips. The face has a tapered jaw.
    g.cone(0,1.51,0,.10,.12,.19,skinTone,10);
    g.sphere(0,1.77,-.008,.43,.54,.39,skinTone,8,14);
    g.sphere(0,1.62,-.06,.31,.22,.29,skinTone,6,12);
    for(const side of [-1,1]){
      g.sphere(side*.211,1.76,.005,.075,.13,.065,'#e8b89a',5,8);
      g.box(side*.09,1.795,-.185,.105,.016,.025,hair,0,0,side*8);
      g.sphere(side*.087,1.76,-.193,.078,.039,.025,'#fff1d9',4,8);g.sphere(side*.085,1.762,-.207,.035,.036,.018,'#293c45',4,8);g.sphere(side*.080,1.772,-.216,.011,.012,.009,'#ffffff',3,5);
      g.box(side*.08,1.785,-.208,.085,.012,.01,hair,0,0,side*4);
    }
    g.sphere(0,1.71,-.205,.05,.08,.045,'#e4ac8d',5,8);g.box(0,1.659,-.204,.058,.012,.016,'#b77466');
    // Sculpted hair cap, swept fringe, tied knot and two flowing locks.
    g.sphere(0,1.96,.035,.46,.29,.42,hair,7,14);
    g.sphere(0,1.80,.11,.43,.43,.25,hair,7,12);
    g.sweep([[0,1.98,.20],[0,1.78,.26],[.025,1.48,.29],[.05,1.23,.34+Math.sin(t*4)*.04]],[.09,.085,.055,.006],hair,9);
    for(let n=0;n<7;n++){const x=(n-3)*.056;g.sweep([[x,2.01,-.08],[x*.91,1.94,-.17],[x*.86+.025,1.83-Math.abs(n-3)*.014,-.185]],[.045,.039,.004],n%2?hair:'#29414a',7);}
    g.sphere(.025,2.115,.11,.23,.23,.23,hair,6,12);g.cone(.025,2.13,.11,.13,.13,.035,gold,12);g.box(.025,2.145,.11,.43,.027,.027,gold,0,12);
    for(const side of [-1,1])g.sweep([[side*.17,1.89,.10],[side*.20,1.61,.18],[side*.14,1.37,.25+Math.sin(t*4)*.04]],[.067,.045,.005],hair,8);
    // Fitted sleeves, bracers, hands and angled elbows.
    for(const side of [-1,1])g.at(side*.30,1.40,0,1,1,1,slide?-80:jump?-100:-stride*side*32,0,side*9,()=>{
      g.cone(0,-.17,0,.115,.095,.34,skin.color,10);
      g.at(0,-.34,0,1,1,1,-20-(moving?Math.max(0,stride*side)*12:0),0,0,()=>{
        g.cone(0,-.12,0,.10,.08,.25,skin.color,10);g.cone(0,-.16,0,.104,.092,.13,skin.accent,10);g.cone(0,-.22,0,.09,.09,.025,gold,10);
        g.sphere(0,-.30,-.01,.14,.17,.12,skinTone,5,9);g.sphere(-side*.06,-.28,-.025,.055,.095,.07,skinTone,4,7);
      });
    });
    // Continuous silk strips instead of disconnected blocks.
    for(const side of [-1,1]){
      const points:Point[]=Array.from({length:9},(_,n)=>[side*(.14+Math.sin(t*5-n*.62)*.05),1.36-n*.058+Math.sin(t*5-n*.7)*.045,.22+n*.14]);
      g.ribbon(points,points.map((_,n)=>.16*(1-n/12)),skin.accent);
      g.ribbon(points.map(([x,y,z])=>[x+side*.065,y+.004,z]),points.map(()=>.018),gold);
    }
    if(skin.form==='traveler'){
      g.box(-.22,1.09,.28,.095,.69,.09,'#28444b',0,0,-23);g.box(-.36,1.43,.30,.26,.04,.07,gold,0,0,-23);
    }
    if(skin.form==='fox'){
      for(const side of [-1,1]){g.cone(side*.21,2.08,.01,0,.12,.39,'#f3dbc4',3,0,0,-side*18);g.cone(side*.21,2.09,-.035,0,.067,.25,'#d28cac',3,0,0,-side*18);}
      for(let n=0;n<9;n++){
        const angle=(n-4)*.30,points:Point[]=Array.from({length:8},(_,i)=>{const v=i/7;return [Math.sin(angle)*(v*1.45),.68+v*(1.25-Math.abs(n-4)*.06)+Math.sin(v*Math.PI)*.35+Math.sin(t*2+n)*.04*v,.30+v*.72+Math.cos(angle)*Math.sin(v*Math.PI)*.25];});
        g.sweep(points,points.map((_,i)=>Math.sin(i/7*Math.PI)*.12+.008),n%2?'#f0d6c5':'#d99bbb',9);
        g.sweep(points.slice(5),[.09,.055,.002],'#fff0da',9);
      }
      g.box(0,1.87,-.20,.12,.035,.025,gold);g.sphere(0,1.85,-.22,.042,.07,.025,'#e88ca4',4,8);
    }
    if(skin.form==='feather'||skin.form==='bifang')for(const side of [-1,1]){
      const fire=skin.form==='bifang';g.at(side*.27,1.27,.24,1,1,1,Math.sin(t*2)*4,side*12,side*(fire?-24:-15),()=>{
        for(let n=0;n<7;n++)feather(g,side*n*.075,n*.018,.025*n,(fire?1.02:1.25)-n*.075,fire?n%2?'#ef9e4e':'#bc4c46':n%2?'#f1ead0':'#b3ded9',-side*(37+n*9));
      });
      for(let n=0;n<3;n++)feather(g,side*.10,2.02,.07,.30+n*.07,skin.accent,side*(20+n*12));
    }
    if(skin.form==='moon'){
      g.ring(0,1.67,.38,.69,.656,'#e8dec1',0,.83);g.ring(0,1.67,.39,.61,.594,'#8da7d4',0,.83);
      for(let n=0;n<7;n++){const a=n/7*Math.PI*1.6;g.sphere(Math.cos(a)*.67,1.67+Math.sin(a)*.67,.39,.065,.065,.05,n%2?gold:'#c8e9eb',4,7);}
      g.ring(0,2.13,-.015,.18,.13,'#e8e5cc',0,.70);g.box(0,1.29,.29,.20,.26,.025,'#b1bbdb',0,0,45);
      for(const side of [-1,1])g.ribbon([[side*.22,.90,.18],[side*.38,.57,.31],[side*.43,.19,.40+Math.sin(t*3)*.07]],[.20,.23,.14],'#9eafd0');
    }
  });
}
