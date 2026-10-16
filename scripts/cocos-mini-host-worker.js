// Runs the actual Creator native export in an OffscreenCanvas worker. Creator's
// own document/window shims are allowed; no browser DOM or WebView is supplied.
const hostFetch = fetch.bind(globalThis), reply = postMessage.bind(globalThis);
const decoder = new TextDecoder();
let root, display, graphics, clock = 0, nextFrame = 0, firstCanvas = true;
let clipboard = '', modalResponse = {confirm: false};
const files = new Map(), modules = new Map(), storage = new Map(), callbacks = new Map(), frames = new Map();
const failures = [], reads = [], sounds = [];
const environment = { documentAbsent: typeof document === 'undefined', windowAbsent: typeof window === 'undefined', worker: true };
console.error = (...args) => { const error=args.map(String).join(' '); if(!failures.includes(error)) failures.push(error); };
addEventListener('error', e => console.error(e.message));
addEventListener('unhandledrejection', e => console.error(e.reason?.stack ?? e.reason));
const normalize = (name, from='') => new URL(name, root + from).pathname.slice(new URL(root).pathname.length);
const dataFor = name => {
  name = name.startsWith(root) ? name.slice(root.length) : name.replace(/^\//,'');
  const value=files.get(name); if (!value) throw Error(`Missing native file: ${name}`); reads.push(name); return value;
};
function requireFrom(from) {
  return name => {
    const file = name.startsWith('.') ? normalize(name,from) : name.replace(/^\/+/, '');
    const key = [file, file+'.js',file+'.json',file+'/index.js'].find(p=>files.has(p));
    if (!key) throw Error(`Native require cannot resolve ${name} from ${from}`);
    if (modules.has(key)) return modules.get(key).exports;
    const module={exports:{}};modules.set(key,module);
    const code=decoder.decode(files.get(key));
    if (key.endsWith('.json')) module.exports=JSON.parse(code);
    else new Function('require','module','exports',code+'\n//# sourceURL='+root+key)(requireFrom(key),module,module.exports);
    return module.exports;
  };
}
function makeCanvas(canvas) {
  canvas.style={};canvas.clientWidth=390;canvas.clientHeight=844;
  canvas.getBoundingClientRect=()=>({left:0,top:0,width:390,height:844});
  canvas.addEventListener=()=>{};canvas.removeEventListener=()=>{};
  const get=canvas.getContext.bind(canvas), contexts=new Map();
  canvas.getContext=(type,...args)=>{
    const context=get(type,...args);if(!context||contexts.has(type))return context;
    contexts.set(type,context);
    if(type==='2d') {
      const draw=context.drawImage.bind(context);
      context.drawImage=(image,...rest)=>draw(image?.bitmap??image,...rest);
    }else {
      if(canvas===display)graphics=context;
      for(const method of ['texImage2D','texSubImage2D']) {
        const call=context[method].bind(context);
        context[method]=(...values)=>call(...values.map(v=>v?.bitmap??v));
      }
    }
    return context;
  };
  return canvas;
}
class NativeImage {
  width=0;height=0;complete=false;bitmap=null;onload=null;onerror=null;listeners={};
  set src(value) {
    this.source=value;
    if(!value){this.bitmap?.close();this.bitmap=null;return;}
    Promise.resolve().then(async()=>{
      const data=value.startsWith('data:')?await(await hostFetch(value)).arrayBuffer():dataFor(value);
      this.bitmap=await createImageBitmap(new Blob([data]),{premultiplyAlpha:'none',colorSpaceConversion:'none'});
      this.width=this.bitmap.width;this.height=this.bitmap.height;this.complete=true;
      this.onload?.({target:this});this.listeners.load?.({target:this});
    }).catch(error=>{this.onerror?.(error);this.listeners.error?.(error);console.error(error)});
  }
  get src(){return this.source;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  removeEventListener(name){delete this.listeners[name];}
}
const success = (o,value={}) => queueMicrotask(()=>{o?.success?.(value);o?.complete?.(value)});
const fs = {
  readFile(o){try{const b=dataFor(o.filePath);success(o,{data:o.encoding?decoder.decode(b):b.slice(0)})}catch(e){queueMicrotask(()=>o.fail?.({errMsg:String(e)}))}},
  readFileSync(file,encoding){const b=dataFor(file);return encoding?decoder.decode(b):b.slice(0)},
  writeFile(o){files.set(o.filePath,new TextEncoder().encode(o.data).buffer);success(o)},
  writeFileSync(file,data){files.set(file,typeof data==='string'?new TextEncoder().encode(data).buffer:data)},
  accessSync(file){dataFor(file)}, access(o){files.has(o.path)?success(o):queueMicrotask(()=>o.fail?.({errMsg:'not found'}))},
  mkdirSync(){},mkdir:success,readdirSync(){return[]},readdir(o){success(o,{files:[]})},
  unlinkSync(file){files.delete(file)},unlink:success,rmdirSync(){},rmdir:success,
  statSync(file){return{size:dataFor(file).byteLength,isDirectory:()=>false,isFile:()=>true}},
  copyFile(o){try{files.set(o.destPath,dataFor(o.srcPath).slice(0));success(o)}catch(e){o.fail?.({errMsg:String(e)})}},
};
function snapshot() {
  let drawn=null;
  if(graphics){const gl=graphics,pixels=new Uint8Array(display.width*display.height*4);gl.readPixels(0,0,display.width,display.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);const colors=new Set();for(let i=0;i<pixels.length;i+=148)colors.add(pixels.slice(i,i+3).join(','));drawn={error:gl.getError(),colors:colors.size,version:gl.getParameter(gl.VERSION)}}
  return {environment,errors:failures,reads:[...new Set(reads)],sounds:sounds.length,clipboard,storage:Object.fromEntries(storage),graphics:drawn,frames:frames.size,state:globalThis.__collectionSnapshot??null};
}
onmessage = async ({data}) => {
  try {
    if(data.type==='boot') {
      root=data.root;display=data.canvas;makeCanvas(display);
      const manifest=await(await hostFetch(root+'__manifest.json')).json();
      await Promise.all(manifest.map(async name=>{const r=await hostFetch(root+name);if(!r.ok)throw Error(`Native preload failed ${name}`);files.set(name,await r.arrayBuffer())}));
      const info={platform:'android',system:'Android 14',version:'8.0.60',SDKVersion:'3.8.0',brand:'test',model:'OffscreenCanvas host',windowWidth:390,windowHeight:844,screenWidth:390,screenHeight:844,pixelRatio:1,devicePixelRatio:1,language:'zh_CN',safeArea:{left:0,right:390,top:44,bottom:810,width:390,height:766}};
      const api={
        env:{USER_DATA_PATH:'user'},getSystemInfoSync:()=>info,getWindowInfo:()=>info,getDeviceInfo:()=>info,getAppBaseInfo:()=>info,getLaunchOptionsSync:()=>({query:data.query??{}}),
        createCanvas:()=>firstCanvas?(firstCanvas=false,display):makeCanvas(new OffscreenCanvas(1,1)),
        createOffscreenCanvas:()=>makeCanvas(new OffscreenCanvas(1,1)),createImage:()=>new NativeImage(),
        getFileSystemManager:()=>fs,getStorageSync:key=>storage.get(key),setStorageSync:(key,value)=>storage.set(key,value),removeStorageSync:key=>storage.delete(key),clearStorageSync:()=>storage.clear(),getStorageInfoSync:()=>({keys:[...storage.keys()]}),
        loadFont:()=> 'sans-serif',getPerformance:()=>performance,getMenuButtonBoundingClientRect:()=>({top:46,bottom:78,left:296,right:380,width:84,height:32}),
        createInnerAudioContext:()=>new Proxy({source:'',get src(){return this.source},set src(value){this.source=value;if(value)dataFor(value)},duration:.1,paused:false,volume:1,play(){sounds.push(this.src)},pause(){},stop(){},destroy(){},seek(){},onCanplay(fn){queueMicrotask(fn)}},{get:(obj,key)=>key in obj?obj[key]:String(key).startsWith('on')||String(key).startsWith('off')?()=>{}:undefined}),
        request(o){try{const b=dataFor(o.url);success(o,{statusCode:200,data:o.responseType==='arraybuffer'?b.slice(0):o.dataType==='json'?JSON.parse(decoder.decode(b)):decoder.decode(b),header:{}})}catch(e){queueMicrotask(()=>o.fail?.({errMsg:String(e)}))}return{abort(){}}},
        downloadFile(o){success(o,{statusCode:200,tempFilePath:o.url})},saveFile:success,
        loadSubpackage(o){requireFrom('game.js')(`subpackages/${o.name}/game.js`);success(o);return{onProgressUpdate(){}}},
        getNetworkType:o=>success(o,{networkType:'wifi'}),getBatteryInfo:o=>success(o,{level:100,isCharging:true}),
        startAccelerometer:success,stopAccelerometer:success,setKeepScreenOn:success,setPreferredFramesPerSecond(){},triggerGC(){},vibrateShort(){},
        setClipboardData(o){clipboard=o.data;success(o)},getClipboardData:o=>success(o,{data:clipboard}),
        showModal:o=>success(o,modalResponse),
        getOpenDataContext:()=>({canvas:makeCanvas(new OffscreenCanvas(1,1)),postMessage(){}}),
      };
      for(const event of ['TouchStart','TouchMove','TouchEnd','TouchCancel','Hide','Show','AppHide','AppShow','WindowResize','NetworkStatusChange','DeviceOrientationChange','AccelerometerChange','AudioInterruptionBegin','AudioInterruptionEnd','Error','UnhandledRejection','KeyboardInput','KeyboardConfirm','KeyboardComplete']) {
        api['on'+event]=fn=>{if(!callbacks.has(event))callbacks.set(event,[]);callbacks.get(event).push(fn)};
        api['off'+event]=fn=>callbacks.set(event,(callbacks.get(event)??[]).filter(f=>f!==fn));
      }
      globalThis[data.target==='weixin'?'wx':'tt']=api;
      globalThis.GameGlobal=globalThis;globalThis.global=globalThis;
      globalThis.__COLLECTION_TEST__=true;
      globalThis.requestAnimationFrame=fn=>{frames.set(++nextFrame,fn);return nextFrame};
      globalThis.cancelAnimationFrame=id=>frames.delete(id);
      Object.defineProperty(globalThis,'performance',{value:{now:()=>clock},configurable:true,writable:true});
      Object.defineProperty(globalThis,'navigator',{value:undefined,configurable:true,writable:true});
      Object.defineProperty(globalThis,'location',{value:{href:root,protocol:'game:',pathname:'/'},configurable:true,writable:true});
      globalThis.fetch=undefined;globalThis.XMLHttpRequest=undefined;
      globalThis.require=requireFrom('game.js');globalThis.requirePlugin=()=>{throw Error('This export must not require an unstaged plugin')};
      globalThis.require('./game.js');
    }else if(data.type==='advance') {globalThis.__collectionAdvance(data.count);
    }else if(data.type==='clipboard') {clipboard=data.value;
    }else if(data.type==='modal') {modalResponse=data.value;
    }else if(data.type==='frames') {
      for(let i=0;i<data.count;i++){clock+=1000/60;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(clock);await Promise.resolve()}
    }else if(data.type==='event') for(const fn of callbacks.get(data.name)??[])fn(data.event);
    reply({id:data.id,value:snapshot()});
  }catch(error){console.error(error.stack??error);reply({id:data.id,value:snapshot()})}
};
