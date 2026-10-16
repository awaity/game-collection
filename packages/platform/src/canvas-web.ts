import type { CanvasHost, Size, CanvasHit } from './canvas-host';
import type { Tone } from './tones';

export function createWebCanvasHost<Sound extends string>(canvas: HTMLCanvasElement, notes: Record<Sound, Tone>): CanvasHost<Sound> {
  const cleanups: (() => void)[] = [], nodes = new Map<string, HTMLButtonElement>(), controls = document.querySelector<HTMLDivElement>('#controls')!, announcement = document.querySelector<HTMLParagraphElement>('#announcement')!;
  let audio: AudioContext | null = null;
  const soundAt: Partial<Record<Sound, number>> = {};
  const listen = (target: EventTarget, event: string, callback: EventListener) => { target.addEventListener(event, callback); cleanups.push(() => target.removeEventListener(event, callback)); };
  function sound(sound: Sound) {
    try {
      audio ??= new AudioContext();
      if (audio.state === 'suspended') void audio.resume().catch(() => {});
      const now = audio.currentTime;
      if (now - (soundAt[sound] ?? -1) < (sound === 'shoot' ? .07 : .035)) return;
      soundAt[sound] = now;
      const n = notes[sound], oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = n.type; oscillator.frequency.setValueAtTime(n.frequency, now); oscillator.frequency.exponentialRampToValueAtTime(n.end, now + n.duration);
      gain.gain.setValueAtTime(.001, now); gain.gain.linearRampToValueAtTime(n.volume, now + .008); gain.gain.exponentialRampToValueAtTime(.001, now + n.duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(now); oscillator.stop(now + n.duration + .01);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch { /* Sound is optional when Web Audio is unavailable. */ }
  }
  function size(): Size {
    const style = getComputedStyle(document.documentElement);
    return { width: document.documentElement.clientWidth, height: window.innerHeight, dpr: Math.min(window.devicePixelRatio || 1, 2), safeTop: parseFloat(style.getPropertyValue('--safe-top')) || 0, safeBottom: parseFloat(style.getPropertyValue('--safe-bottom')) || 0 };
  }
  return {
    canvas, size, reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
    read(key) { try { return localStorage.getItem(key); } catch { return null; } },
    write(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
    frame: callback => requestAnimationFrame(callback), cancelFrame: id => cancelAnimationFrame(id),
    onPointer(callback) { listen(canvas, 'pointerdown', ((e: PointerEvent) => { if (e.button !== 0) return; e.preventDefault(); callback(e.clientX, e.clientY); }) as EventListener); },
    onMove(callback) { listen(document.querySelector('#game-root')!, 'pointermove', ((e: PointerEvent) => { if (e.pointerType === 'mouse') callback(e.clientX, e.clientY); }) as EventListener); },
    onKey(callback) { listen(window, 'keydown', ((e: KeyboardEvent) => { if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return; if (/^(Arrow| |[1-8sxSX]|Escape)/.test(e.key)) e.preventDefault(); if (e.key.startsWith('Arrow')) canvas.focus({ preventScroll: true }); if (e.key === 'Enter' && document.activeElement instanceof HTMLButtonElement) return; callback(e.key); }) as EventListener); },
    onResize(callback) { listen(window, 'resize', callback); if (window.visualViewport) listen(window.visualViewport, 'resize', callback); },
    onHide(callback) { listen(document, 'visibilitychange', () => { if (document.hidden) callback(); }); listen(window, 'blur', callback); listen(window, 'pagehide', callback); },
    sound,
    silence() { if (audio?.state === 'running') void audio.suspend().catch(() => {}); },
    syncControls(hits: CanvasHit[], action) {
      const keep = new Set(hits.map(h => h.id));
      for (const [id, node] of nodes) if (!keep.has(id)) { node.remove(); nodes.delete(id); }
      hits.forEach((hit, index) => {
        let node = nodes.get(hit.id);
        if (!node) { node = document.createElement('button'); node.type = 'button'; node.dataset.action = hit.id; node.addEventListener('click', () => action(hit.id)); controls.appendChild(node); nodes.set(hit.id, node); }
        node.style.cssText = `left:${hit.x}px;top:${hit.y}px;width:${hit.w}px;height:${hit.h}px;z-index:${index + 1}`;
        if (node.textContent !== hit.label) node.textContent = hit.label;
        node.disabled = !!hit.disabled;
      });
    },
    announce(message) { announcement.textContent = message; },
    destroy() { for (const cleanup of cleanups) cleanup(); for (const node of nodes.values()) node.remove(); if (audio) void audio.close().catch(() => {}); },
  };
}
