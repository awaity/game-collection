import {readFile} from 'node:fs/promises';
const shared=new URL('../../../shared/',import.meta.url);
export async function brandHtml(html,title){
  if(html.includes('id="collection-entrance"'))return html;
  const [mark,css,js]=await Promise.all(['brand/mark.svg','entrance.css','entrance.js'].map(p=>readFile(new URL(p,shared),'utf8')));
  const safe=title.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const overlay=`<section id="collection-entrance" role="dialog" aria-label="开局游戏入场" aria-modal="true" tabindex="-1"><div class="entrance-content">${mark}<strong>开局游戏</strong><p class="entrance-title">${safe}</p><p class="entrance-status" role="status">正在准备游戏…</p><div class="entrance-track" aria-hidden="true"></div></div><div class="entrance-actions"><button data-skip disabled>跳过入场动画</button><button data-retry hidden>重新加载</button><a data-back hidden>返回大厅</a></div></section><script>${js}</script>`;
  return html.replace(/<link\b[^>]*\brel=["']icon["'][^>]*>/gi,'').replace('</head>',`<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(mark)}"><style>${css}</style></head>`).replace(/<body([^>]*)>/,`<body$1>${overlay}`);
}
export function brandPlugin(title){return {name:'kaiju-entrance',transformIndexHtml:{order:'post',handler:html=>brandHtml(html,title)}};}
