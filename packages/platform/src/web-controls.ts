export interface CanvasButton {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  disabled?:boolean;
}
/** Accessible Web mirrors of the same controls drawn inside the native Canvas. */
export function syncCanvasControls(
  container: HTMLElement,
  buttons: CanvasButton[],
  width: number,
  height: number,
  action: (id: string) => void,
) {
  const focused = (document.activeElement as HTMLElement)?.dataset?.action;
  const fragment = document.createDocumentFragment();
  for (const button of buttons) {
    const element = document.createElement("button");
    element.type = "button";
    element.disabled=!!button.disabled;
    element.dataset.action = button.id;
    element.textContent = button.label;
    element.style.cssText = `left:${(button.x / width) * 100}%;top:${(button.y / height) * 100}%;width:${(button.w / width) * 100}%;height:${(button.h / height) * 100}%`;
    element.onclick = () => action(button.id);
    fragment.append(element);
  }
  container.replaceChildren(fragment);
  if (focused)
    Array.from(container.querySelectorAll("button"))
      .find((button) => button.dataset.action === focused)
      ?.focus({ preventScroll: true });
}
