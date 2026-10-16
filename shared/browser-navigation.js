// Added only to the assembled Web site. Native Mini Games do not load this file.
const link = document.createElement("a");
link.href = "../../";
link.textContent = "← 返回游戏厅";
link.setAttribute("aria-label", "返回游戏合集大厅");
link.title = "返回游戏厅";
link.className = "collection-return";
link.hidden = true;
const style = document.createElement("style");
style.textContent =
  ".collection-return{position:fixed;top:max(12px,env(safe-area-inset-top));right:14px;z-index:1000;padding:10px 14px;background:#fffdf3;color:#263a42;border:1px solid #d9dfd8;border-radius:24px;font:600 12px/1.4 system-ui,sans-serif;text-decoration:none;box-shadow:0 2px 10px #122f2c17}.collection-return[hidden]{display:none}.collection-return:hover{background:#eef0fe}.collection-return:focus-visible{outline:3px solid #645ac8;outline-offset:3px}@media(min-width:721px){.collection-return{left:20px;right:auto;top:18px}}";
document.head.append(style);
style.textContent += '[data-collection-engine="cocos"] .collection-return{top:auto;left:auto;right:14px;bottom:max(88px,env(safe-area-inset-bottom));box-sizing:border-box;width:72px;height:36px;padding:8px 0;text-align:center}';
style.textContent += '[data-collection-game="garden-guard"] .collection-return{top:auto;left:auto;right:14px;bottom:max(12px,env(safe-area-inset-bottom));box-sizing:border-box;width:72px;height:36px;padding:8px 0;text-align:center}';
document.body.append(link);
const activePointers = new Set();
function placeMenuLink() {
  const garden = document.documentElement.dataset.collectionGame === 'garden-guard';
  if (!garden && document.documentElement.dataset.collectionEngine !== "cocos") return;
  link.textContent = "← 大厅";
  const controls = [...document.querySelectorAll(garden ? '#controls button' : '.cocos-control:not([hidden])')]
    .map(button => button.getBoundingClientRect());
  const top = "max(12px,env(safe-area-inset-top))";
  const bottom = "max(12px,env(safe-area-inset-bottom))";
  const positions = [
    {top:"auto", bottom:"max(88px,env(safe-area-inset-bottom))", left:"auto", right:"14px"},
    {top, bottom:"auto", left:"12px", right:"auto"},
    {top, bottom:"auto", left:"auto", right:"12px"},
    {top:"auto", bottom, left:"12px", right:"auto"},
    {top:"auto", bottom, left:"auto", right:"12px"},
  ];
  if (garden) {
    // The garden home has stars/settings at the top. Prefer its empty footer;
    // short screens can use the illustration edge without covering controls.
    const home = document.querySelector('[data-action="continue-level"]');
    positions.splice(0, positions.length,
      ...(home ? [
        {top:'auto',bottom,left:'auto',right:'14px'},
        {top:'160px',bottom:'auto',left:'14px',right:'auto'},
      ] : [
        {top,bottom:'auto',left:'auto',right:'14px'},
        {top:'auto',bottom,left:'auto',right:'14px'},
      ]));
  }
  // Small/landscape menus may occupy both corners. Look along the edges too.
  for (let y=60; y<innerHeight-84; y+=44) {
    positions.push({top:`${y}px`,bottom:"auto",left:"12px",right:"auto"});
    positions.push({top:`${y}px`,bottom:"auto",left:"auto",right:"12px"});
  }
  let best=positions[0],score=Infinity;
  for (const position of positions) {
    Object.assign(link.style,position);
    const r=link.getBoundingClientRect();
    const overlap=controls.reduce((sum,b)=>sum+
      Math.max(0,Math.min(r.right+4,b.right)-Math.max(r.left-4,b.left))*
      Math.max(0,Math.min(r.bottom+4,b.bottom)-Math.max(r.top-4,b.top)),0);
    if(overlap<score){best=position;score=overlap}
    if(overlap===0)break;
  }
  Object.assign(link.style,best);
}
function update() {
  const hidden =
    activePointers.size > 0 ||
    !["menu", "paused", "result"].includes(
      document.documentElement.dataset.collectionState,
    );
  if(link.hidden!==hidden)link.hidden=hidden;
  if(!hidden)placeMenuLink();
}
let scheduled=false;
const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;update()})}};
// Menus can change pages without changing the game's menu/paused state.
// Ignore this link's own styles and repeated identical Creator attributes.
new MutationObserver(records=>{
  if(records.some(r=>r.target!==link && (r.type==='childList'||r.oldValue!==r.target.getAttribute(r.attributeName))))schedule();
}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeOldValue:true,attributeFilter:['style','hidden']});
window.addEventListener('resize',schedule);
// Canvas games may pause on pointerdown. Revealing a link beneath the active
// finger before pointerup would let the same gesture accidentally navigate away.
document.addEventListener(
  "pointerdown",
  (event) => {
    activePointers.add(event.pointerId);
  },
  true,
);
const endPointer = (event) => {
  activePointers.delete(event.pointerId);
  requestAnimationFrame(update); // after the matching click has been dispatched
};
document.addEventListener("pointerup", endPointer, true);
document.addEventListener("pointercancel", endPointer, true);
document.addEventListener("collection:statechange", update);
update();
