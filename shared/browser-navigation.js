// Added only to the assembled Web site. Native Mini Games do not load this file.
const link = document.createElement("a");
link.href = "../../";
link.textContent = "← 返回游戏厅";
link.setAttribute("aria-label", "返回游戏合集大厅");
link.className = "collection-return";
link.hidden = true;
const style = document.createElement("style");
style.textContent =
  ".collection-return{position:fixed;top:max(12px,env(safe-area-inset-top));right:14px;z-index:1000;padding:10px 14px;background:#fffdf3;color:#263a42;border:1px solid #d9dfd8;border-radius:24px;font:600 12px/1.4 system-ui,sans-serif;text-decoration:none;box-shadow:0 2px 10px #122f2c17}.collection-return[hidden]{display:none}.collection-return:hover{background:#eef0fe}.collection-return:focus-visible{outline:3px solid #645ac8;outline-offset:3px}@media(min-width:721px){.collection-return{left:20px;right:auto;top:18px}}";
document.head.append(style);
style.textContent += '[data-collection-engine="cocos"] .collection-return{top:auto;left:auto;right:14px;bottom:max(88px,env(safe-area-inset-bottom))}';
document.body.append(link);
const activePointers = new Set();
function update() {
  link.hidden =
    activePointers.size > 0 ||
    !["menu", "paused", "result"].includes(
      document.documentElement.dataset.collectionState,
    );
}
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
