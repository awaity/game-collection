import { BufferAsset, Color, EffectAsset, Material, Mesh, Texture2D, Vec4, gfx, primitives, resources, utils } from 'cc';
import { GameView } from 'db://assets/collection/runtime';

interface MeshHeader { name: string; vertices: number; indices: number; offset: number; indexOffset: number }
const loadBuffer = (name='models') => new Promise<BufferAsset>((resolve,reject) => resources.load(name, BufferAsset, (e,a) => e ? reject(e) : resolve(a)));
const loadTexture = (name: string) => new Promise<Texture2D>((resolve,reject) => resources.load(`${name}/texture`, Texture2D, (e,a) => e ? reject(e) : resolve(a)));
const normalize = (v: number[]) => { const d = Math.hypot(...v); return v.map(x => x / d); };
const dot = (a: number[], b: number[]) => a.reduce((s,v,i) => s + v * b[i], 0);

/** Original procedural meshes and baked poses, rendered by Creator MeshRenderer. */
export class SceneArt {
  readonly models = new Map<string, Mesh>();
  readonly actorFrames: Mesh[] = [];
  readonly modelMaterial: Material;
  readonly gateBlue: Material;
  readonly gateRed: Material;
  readonly actorMaterial: Material;
  readonly shadowMaterial: Material;
  readonly roadMaterial: Material;
  readonly projectionMaterial: Material;
  readonly bossMaterial: Material;
  readonly hitMaterial: Material;
  readonly effects = new Map<string,Material>();
  private constructor(ui: GameView, buffer: ArrayBuffer, joints: ArrayBuffer, atlas: Texture2D, shadow: Texture2D, skinEffect: EffectAsset) {
    const bytes = new DataView(buffer), length = bytes.getUint32(0,true);
    // The header contains ASCII names only; no browser TextDecoder dependency.
    const header: MeshHeader[] = JSON.parse(String.fromCharCode(...new Uint8Array(buffer,4,length)));
    const base = Math.ceil((4 + length) / 4) * 4;
    const sun = normalize([-.53,1,.46]), fill = normalize([.8,.25,-.7]);
    for (const model of header) {
      const positions: number[] = [], colors: number[] = [];
      for (let i = 0; i < model.vertices; i++) {
        const pos = base + model.offset + i * 20;
        const p = [0,4,8].map(o => bytes.getFloat32(pos + o,true)); positions.push(...p);
        const n = normalize([12,13,14].map(o => bytes.getInt8(pos + o) / 127));
        let c = [15,16,17].map(o => bytes.getUint8(pos + o) / 255);
        if (model.name === 'gateGeometry') c = Array(3).fill(.48 + c[2] * .88);
        const view = normalize([-p[0],21.4-p[1],20.3-p[2]]);
        const h = normalize(sun.map((v,j) => v + view[j]));
        const diffuse = Math.max(0, dot(n,sun));
        const specular = Math.pow(Math.max(0,dot(n,h)),93) * .73 * 1.12;
        const rim = Math.pow(1-Math.max(0,dot(n,view)),3) * Math.max(0,n[1]) * .14;
        for (let j = 0; j < 3; j++) {
          const hemi = [.125,.165,.235][j] + ([.39,.46,.61][j] - [.125,.165,.235][j]) * (n[1]*.5+.5);
          const light = c[j] * (hemi + [1,.94,.89][j] * diffuse + Math.max(0,dot(n,fill)) * .19) + [.8,.94,1][j] * specular + [.20,.50,.8][j]*rim;
          colors.push(Math.pow(Math.min(1,Math.max(0,light)),1/2.2));
        }
        colors.push(1);
      }
      const indices = Array.from(new Uint16Array(buffer, base + model.indexOffset, model.indices));
      this.models.set(model.name, utils.createMesh({positions, colors, indices,...(model.name==='bossGeometry'?{uvs:Array.from(new Float32Array(joints))}:{})}));
    }
    const material = (hex: string, texture?: Texture2D) => {
      const value = new Material(); value.initialize({effectAsset: ui.effect, defines: {USE_TEXTURE: Boolean(texture), USE_VERTEX_COLOR: !texture}});
      value.setProperty('mainColor', new Color().fromHEX(hex));
      if (texture) { value.setProperty('mainTexture',texture); value.overridePipelineStates({depthStencilState: {depthWrite:false}}); }
      return value;
    };
    this.modelMaterial = material('#ffffff'); this.gateBlue = material('#118ef0'); this.gateRed = material('#ed2857');
    this.actorMaterial = material('#ffffff', atlas); this.playerMaterial=new Material();this.playerMaterial.initialize({effectAsset:skinEffect});this.playerMaterial.setProperty('mainTexture',atlas); this.shadowMaterial = material('#09111a40', shadow);
    // Original atlas stores premultiplied RGB; applying alpha twice darkens its edges.
    this.actorMaterial.overridePipelineStates({depthStencilState:{depthWrite:true},blendState:{targets:[{blend:true,blendSrc:gfx.BlendFactor.ONE,blendDst:gfx.BlendFactor.ONE_MINUS_SRC_ALPHA}]}});
    this.bossMaterial=new Material();this.bossMaterial.initialize({effectAsset:ui.effect,defines:{USE_BOSS:true,USE_FLASH:true,USE_VERTEX_COLOR:true}});
    this.hitMaterial=new Material();this.hitMaterial.initialize({effectAsset:ui.effect,defines:{USE_TEXTURE:true,USE_FLASH:true}});this.hitMaterial.setProperty('mainTexture',atlas);this.hitMaterial.setProperty('flashParams',new Vec4(.65,0,0,0));
    this.hitMaterial.overridePipelineStates({blendState:{targets:[{blend:true,blendSrc:gfx.BlendFactor.ONE,blendDst:gfx.BlendFactor.ONE_MINUS_SRC_ALPHA}]}});
    this.models.set('supplyRing',utils.createMesh(primitives.torus(.5,.018,{radialSegments:4,tubularSegments:40})));
    this.models.set('effect-flat',utils.createMesh({positions:[-.5,0,.5,.5,0,.5,.5,0,-.5,-.5,0,-.5],uvs:[0,0,1,0,1,1,0,1],indices:[0,1,2,0,2,3]}));
    this.models.set('effect-vertical',utils.createMesh({positions:[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],uvs:[0,0,1,0,1,1,0,1],indices:[0,1,2,0,2,3]}));
    this.roadMaterial = new Material(); this.roadMaterial.initialize({effectAsset:ui.effect,defines:{USE_ROAD:true}});
    this.projectionMaterial = new Material(); this.projectionMaterial.initialize({effectAsset:ui.effect,defines:{USE_PROJECTED_SHADOW:true}});
    this.projectionMaterial.setProperty('mainColor',new Color().fromHEX('#09111a38'));
    for (let frame = 0; frame < 64; frame++) {
      const u = frame % 8 / 8, v = 1 - (Math.floor(frame / 8) + 1) / 8;
      this.actorFrames.push(utils.createMesh({positions: [-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0], uvs: [u,v+.125,u+.125,v+.125,u+.125,v,u,v], indices: [0,1,2,0,2,3]}));
    }
  }
  static async load(ui: GameView) {
    const [,buffer,joints,atlas,shadow,skinEffect] = await Promise.all([ui.ready,loadBuffer(),loadBuffer('boss-joints'),loadTexture('atlas'),loadTexture('silhouette'),new Promise<EffectAsset>((resolve,reject)=>resources.load('skin',EffectAsset,(e,a)=>e?reject(e):resolve(a)))]);
    return new SceneArt(ui,buffer.buffer(),joints.buffer(),atlas,shadow,skinEffect);
  }
  fx(ui:GameView,id:string,kind:number,x:number,y:number,z:number,sx:number,sz:number,rgba:number[],vertical=false){
    let material=this.effects.get(id);
    if(!material){material=new Material();material.initialize({effectAsset:ui.effect,defines:{USE_FX:true}});material.overridePipelineStates({depthStencilState:{depthWrite:false},blendState:{targets:[{blend:true,blendSrc:gfx.BlendFactor.SRC_ALPHA,blendDst:gfx.BlendFactor.ONE}]}});this.effects.set(id,material);}
    material.setProperty('mainColor',new Color(rgba[0]*255,rgba[1]*255,rgba[2]*255,rgba[3]*255));material.setProperty('flashParams',new Vec4(0,kind,0,0));
    const node=ui.meshNode(id,this.models.get(vertical?'effect-vertical':'effect-flat')!,material,x,y,z,sx,vertical?sz:1,vertical?1:sz);
    if(vertical)node.setRotation(ui.camera.node.rotation);
  }
  skinColor='#ffffff';private playerMaterial:Material|null=null;
  actor(ui: GameView, id: string, frame: number, x: number, z: number, scale = 2, flash=false) {
    if(id.startsWith('member')){this.playerMaterial!.setProperty('mainColor',new Color().fromHEX(this.skinColor));}
    const node = ui.meshNode(id,this.actorFrames[frame],flash?this.hitMaterial:id.startsWith('member')?this.playerMaterial!:this.actorMaterial,x,.83,z,scale,scale,1);
    node.setRotation(ui.camera.node.rotation);
    const shadow = ui.meshNode(`shadow:${id}`,this.actorFrames[frame],this.shadowMaterial,x,.025,z,3,3,1);
    shadow.setRotationFromEuler(-90,0,0);
    return node;
  }
  destroy() {
    this.playerMaterial?.destroy();
    for (const mesh of Array.from(this.models.values()).concat(this.actorFrames)) mesh.destroy();
    for (const mat of [this.modelMaterial,this.gateBlue,this.gateRed,this.actorMaterial,this.shadowMaterial,this.roadMaterial,this.projectionMaterial,this.bossMaterial,this.hitMaterial,...Array.from(this.effects.values())]) mat.destroy();
  }
}
