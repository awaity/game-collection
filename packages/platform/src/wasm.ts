/** Native mini games require a static .wasm path inside a code package. */
export interface WasmHost{
 WebAssembly?:{instantiate:(bytes:BufferSource,imports:WebAssembly.Imports)=>Promise<WebAssembly.WebAssemblyInstantiatedSource>};
 WXWebAssembly?:NativeWasm;TTWebAssembly?:NativeWasm;wx?:NativePackages;tt?:NativePackages;
}
interface NativeWasm{instantiate(path:string,imports:WebAssembly.Imports):Promise<{instance?:{exports:WebAssembly.Exports};exports?:WebAssembly.Exports}>}
interface NativePackages{loadSubpackage(options:{name:string;success:()=>void;fail:(e:unknown)=>void}):unknown}
export interface WasmOptions{nativePath:string;subpackage:string;host?:WasmHost}
export async function instantiateWasm(bytes:Uint8Array,imports:WebAssembly.Imports,options:WasmOptions):Promise<WebAssembly.Exports>{
 const host=options.host??globalThis as unknown as WasmHost,native=host.WXWebAssembly??host.TTWebAssembly,api=host.wx??host.tt;
 if(api){
  if(!native)throw new Error('Native WebAssembly is unavailable in this platform version');
  if(!/^subpackages\/[a-z0-9-]+\/[a-z0-9-]+\.wasm$/.test(options.nativePath))throw new Error('Native WASM must use a static code-package path');
  await new Promise<void>((resolve,reject)=>api.loadSubpackage({name:options.subpackage,success:resolve,fail:reject}));
  const result=await native.instantiate(options.nativePath,imports),exports=result.instance?.exports??result.exports;
  if(!exports)throw new Error('Native WebAssembly did not return exports');return exports;
 }
 if(!host.WebAssembly)throw new Error('This runtime does not provide WebAssembly');
 return(await host.WebAssembly.instantiate(new Uint8Array(bytes),imports)).instance.exports;
}
