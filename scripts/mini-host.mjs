import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import path from "node:path";
import { root } from "./site-config.mjs";
export async function createMiniHost() {
  const html = `<!doctype html><html><meta charset="utf-8"><body style="margin:0;background:#15212d"><canvas width="390" height="844"></canvas><script>
 const worker=new Worker('/worker.js'),pending=new Map();let id=0;
 worker.onmessage=({data})=>{pending.get(data.id)?.(data.value);pending.delete(data.id);};
 window.call=(data,transfer=[])=>new Promise((resolve,reject)=>{const request=++id;const timer=setTimeout(()=>{pending.delete(request);reject(Error('Native host request timed out: '+data.type));},45000);pending.set(request,value=>{clearTimeout(timer);resolve(value);});worker.postMessage({...data,id:request},transfer);});
 window.boot=(slug,target,webglVersion)=>{const canvas=document.querySelector('canvas').transferControlToOffscreen();return call({type:'boot',canvas,target,webglVersion,root:location.origin+'/games/'+slug+'/dist/'+target+'/'},[canvas]);};
 </script></body></html>`;
  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, "http://localhost").pathname;
      if (pathname === "/") {
        res.setHeader("Content-Type", "text/html");
        res.end(html);
        return;
      }
      let file;
      if (pathname === "/worker.js")
        file = path.join(root, "scripts/mini-host-worker.js");
      else if (
        /^\/games\/[a-z-]+\/dist\/(weixin|douyin)\/[a-zA-Z0-9/._-]+$/.test(
          pathname,
        ) &&
        !pathname.includes("..")
      )
        file = path.join(root, pathname);
      else throw Error("not found");
      res.setHeader(
        "Content-Type",
        file.endsWith(".js") ? "text/javascript" : "application/octet-stream",
      );
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: async () => {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
