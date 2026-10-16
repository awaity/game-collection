interface MiniServices {
  getSystemInfoSync?(): {windowHeight?: number; safeArea?: {top: number; bottom: number}};
  getMenuButtonBoundingClientRect?(): {bottom: number};
  getLaunchOptionsSync?(): {query?: Record<string, string>};
  shareAppMessage?(options: {title: string; query: string}): void;
  setClipboardData?(options: { data: string; success(): void; fail(): void }): void;
  getClipboardData?(options: { success(value: {data: string}): void; fail(): void }): void;
  showModal?(options: { title: string; content: string; editable: boolean; success(value: {confirm: boolean; content?: string}): void; fail(): void }): void;
}
const native = () => (globalThis as unknown as {wx?: MiniServices; tt?: MiniServices}).wx ?? (globalThis as unknown as {tt?: MiniServices}).tt;

/** File/clipboard capabilities belong to the platform, never to simulation code. */
export function cocosServices(browser: boolean) {
  return {
    reducedMotion: browser && matchMedia('(prefers-reduced-motion: reduce)').matches,
    insets() {
      if(browser)return {top:0,bottom:0,menuBottom:0};
      const api=native(),info=api?.getSystemInfoSync?.();
      return {top:info?.safeArea?.top??0,bottom:Math.max(0,(info?.windowHeight??0)-(info?.safeArea?.bottom??0)),menuBottom:api?.getMenuButtonBoundingClientRect?.().bottom??0};
    },
    launchQuery(): Record<string,string> {
      if (!browser) return native()?.getLaunchOptionsSync?.().query ?? {};
      const query: Record<string,string> = {};
      new URLSearchParams(location.search).forEach((value, key) => { query[key] = value; });
      return query;
    },
    challengeUrl(seed: number, route: number, slug = 'final-door') {
      const base=browser ? location.origin+location.pathname : `https://awaity.github.io/game-collection/games/${encodeURIComponent(slug)}/`;
      return `${base}?seed=${seed}&route=${route}&mode=interactive`;
    },
    async copy(text: string): Promise<boolean> {
      if(browser){try{await navigator.clipboard.writeText(text);return true}catch{return false}}
      return new Promise(resolve=>{const api=native();if(!api?.setClipboardData)return resolve(false);api.setClipboardData({data:text,success:()=>resolve(true),fail:()=>resolve(false)})});
    },
    async share(title: string, text: string, url: string, query: string): Promise<'opened'|'copied'|'cancelled'|'unavailable'> {
      if(browser) {
        if(navigator.share){try{await navigator.share({title,text,url});return 'opened'}catch{return 'cancelled'}}
        try{await navigator.clipboard.writeText(`${text}\n${url}`);return 'copied'}catch{return 'unavailable'}
      }
      const api=native();if(!api?.shareAppMessage)return 'unavailable';
      api.shareAppMessage({title:`${title} · ${text}`,query});return 'opened';
    },
    async exportText(filename: string, text: string): Promise<boolean> {
      if (browser) {
        const url = URL.createObjectURL(new Blob([text], {type: 'application/json;charset=utf-8'}));
        const link = document.createElement('a'); link.href = url; link.download = filename;
        link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); return true;
      }
      return new Promise(resolve => {
        const api = native();
        if (!api?.setClipboardData) return resolve(false);
        api.setClipboardData({data: text, success: () => resolve(true), fail: () => resolve(false)});
      });
    },
    async importText(): Promise<string | null> {
      if (browser) return new Promise(resolve => {
        const file = document.createElement('input'); file.type = 'file'; file.accept = '.json,application/json';
        file.onchange = async () => resolve(file.files?.[0] ? await file.files[0].text() : null);
        file.addEventListener('cancel', () => resolve(null)); file.click();
      });
      return new Promise(resolve => {
        const api = native();
        if (!api?.getClipboardData) return resolve(null);
        api.getClipboardData({success: result => resolve(result.data), fail: () => resolve(null)});
      });
    },
    async prompt(title: string, value: string): Promise<string | null> {
      if (browser) return window.prompt(title, value);
      return new Promise(resolve => {
        const api = native();
        if (!api?.showModal) return resolve(null);
        api.showModal({title, content: value, editable: true, success: result => resolve(result.confirm ? result.content ?? null : null), fail: () => resolve(null)});
      });
    },
  };
}

export interface CanvasControl { id: string; label: string; x: number; y: number; width: number; height: number; action(): void }
/** Semantic Web controls mirror visible native Canvas buttons at the same positions. */
export class CocosWebControls {
  private root: HTMLDivElement;
  private buttons = new Map<string, HTMLButtonElement>();
  private state = '';
  private activated = false;
  constructor() {
    document.documentElement.dataset.collectionEngine = 'cocos';
    this.root = document.createElement('div');
    this.root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5';
    this.root.setAttribute('aria-label', '游戏操作');
    const style = document.createElement('style');
    style.textContent = '.cocos-control{position:absolute;transform:translate(-50%,-50%);border:0;background:transparent;color:transparent;font-size:0;pointer-events:auto;cursor:pointer;border-radius:10px;touch-action:manipulation}.cocos-control:focus-visible{outline:3px solid #9af2ff;outline-offset:3px}';
    this.root.append(style); document.body.append(this.root);
  }
  sync(controls: CanvasControl[], width: number, height: number) {
    const active = new Set(controls.map(control => control.id));
    for (const [id,button] of this.buttons) if (!active.has(id)) button.hidden = true;
    for (const control of controls) {
      let button = this.buttons.get(control.id);
      if (!button) {
        button = document.createElement('button'); button.className = 'cocos-control'; button.type = 'button';
        this.root.append(button); this.buttons.set(control.id, button);
      }
      button.hidden = false; button.setAttribute('aria-label', control.label);
      button.onclick = () => { control.action(); this.activated = true; };
      Object.assign(button.style, {left: `${control.x / width * 100}%`, top: `${control.y / height * 100}%`, width: `${control.width / width * 100}%`, height: `${control.height / height * 100}%`});
    }
    const state = document.documentElement.dataset.collectionState ?? '';
    // Creator listens for keyboard events on its canvas. Starting/resuming from
    // a semantic Web button must hand keyboard control back to the game.
    if (state === 'playing' && (this.state !== state || this.activated)) document.getElementById('GameCanvas')?.focus({ preventScroll: true });
    this.state = state;
    this.activated = false;
  }
  destroy() { this.root.remove(); }
}
