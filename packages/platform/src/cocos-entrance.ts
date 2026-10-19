/** Pre-engine native boot screen. Only platform APIs and WebGL; no engine patch. */
import {drawBrand} from './brand';
type BootCanvas={width:number;height:number;getContext(type:string,options?:unknown):any};
const env=globalThis as unknown as {canvas:BootCanvas;wx?:API;tt?:API;WebGL2RenderingContext?:unknown;__COLLECTION_TEST__?:boolean;__collectionBootBrand?:{drawn:boolean;ended:boolean}};
type API={createCanvas():BootCanvas;getSystemInfoSync():{windowWidth:number;windowHeight:number}};
let gl:WebGLRenderingContext|null=null,program:WebGLProgram|null=null,buffer:WebGLBuffer|null=null,texture:WebGLTexture|null=null;
let frame=0,active=false;
function shader(kind:number,source:string){const s=gl!.createShader(kind)!;gl!.shaderSource(s,source);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS))throw Error(gl!.getShaderInfoLog(s)??'Brand shader failed');return s;}
function draw(){if(!gl||!program)return;gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.BLEND);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const at=gl.getAttribLocation(program,'point');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(gl.getUniformLocation(program,'picture'),0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
function tick(){if(!active)return;draw();frame=requestAnimationFrame(tick);}
export function start(alpha='default',antialias='default',useWebgl2='false'){
 const options={alpha:alpha==='true',antialias:antialias!=='false',depth:true,stencil:true,premultipliedAlpha:false,preserveDrawingBuffer:false};
 gl=useWebgl2==='true'?env.canvas.getContext('webgl2',options):null;env.WebGL2RenderingContext=!!gl;gl??=env.canvas.getContext('webgl',options);
 if(!gl)throw Error('WebGL unavailable');
 const api=env.wx??env.tt;if(!api)throw Error('Mini game host unavailable');
 const info=api.getSystemInfoSync(),surface=api.createCanvas(),scale=Math.min(2,env.canvas.width/info.windowWidth);
 surface.width=Math.round(info.windowWidth*scale);surface.height=Math.round(info.windowHeight*scale);
 drawBrand(surface.getContext('2d'),info.windowWidth,info.windowHeight,0,false,scale);
 const vs=shader(gl.VERTEX_SHADER,'attribute vec2 point;varying vec2 uv;void main(){gl_Position=vec4(point,0.,1.);uv=vec2((point.x+1.)*.5,(1.-point.y)*.5);}');
 const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 uv;uniform sampler2D picture;void main(){gl_FragColor=texture2D(picture,uv);}');
 program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)??'Brand program failed');
 buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,surface as unknown as HTMLCanvasElement);
 active=true;tick();if(env.__COLLECTION_TEST__)env.__collectionBootBrand={drawn:true,ended:false};return Promise.resolve();
}
// The Creator boot API supplies stage percentages, but the user sees only a
// preparing state until the actual scene is ready, never a fabricated counter.
export function setProgress(_value:number){draw();return Promise.resolve();}
export function end(){
 active=false;cancelAnimationFrame(frame);
 if(gl){gl.useProgram(null);gl.bindTexture(gl.TEXTURE_2D,null);gl.bindBuffer(gl.ARRAY_BUFFER,null);gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);}gl=null;
 if(env.__collectionBootBrand)env.__collectionBootBrand.ended=true;return Promise.resolve();
}
