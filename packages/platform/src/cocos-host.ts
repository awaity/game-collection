import { reportGameState, type CollectionState } from './web-state';

/** Creator supplies its own canvas, storage and lifecycle on each platform. */
export interface CocosHost {
  browser: boolean;
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  onHide(callback: () => void): () => void;
}

export function createCocosPlatform(host: CocosHost, key: string) {
  return {
    load<T>(fallback: T): T {
      try { const data = host.storage.getItem(key); return data ? JSON.parse(data) as T : fallback; }
      catch { return fallback; }
    },
    save(value: unknown): boolean {
      try { host.storage.setItem(key, JSON.stringify(value)); return true; }
      catch { return false; }
    },
    onHide: host.onHide,
    state(state: CollectionState) {
      // Native builds never construct a DOM or embed the Web portal.
      if (host.browser) reportGameState(state);
    },
  };
}
