export function brandHtml(html:string,title:string):Promise<string>;
export function brandPlugin(title:string):{name:string;transformIndexHtml:{order:'post';handler:(html:string)=>Promise<string>}};
