/** Render official Creator frames on demand in software-GPU verification.
 * Input still goes through real browser events; this only stops the engine's
 * automatic frame queue. Rule advancement uses each game's existing QA hook.
 */
export async function presentCocos(page) {
  return page.evaluate(async () => {
    if (!globalThis.__COLLECTION_TEST__) throw Error('Creator test flag required');
    const { game } = await System.import('cc');
    game.pause();
    game.step();
    return window.__collectionSnapshot;
  });
}
