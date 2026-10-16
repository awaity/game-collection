export type CollectionState = "menu" | "playing" | "paused" | "result";
/** Web shell contract. No game-specific DOM selectors or imports in native builds. */
export function reportGameState(state: CollectionState) {
  if (document.documentElement.dataset.collectionState === state) return;
  document.documentElement.dataset.collectionState = state;
  document.dispatchEvent(
    new CustomEvent("collection:statechange", { detail: state }),
  );
}
