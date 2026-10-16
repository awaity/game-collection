import "./style.css";
import { App } from "./app";
import { WebPlatform } from "@game-collection/platform/web";
import { reportGameState } from "@game-collection/platform/web-state";
import { syncCanvasControls } from "@game-collection/platform/web-controls";
try {
  const app = new App(
    new WebPlatform(document.querySelector<HTMLCanvasElement>("#game")!),
  );
  const update = () => {
    syncCanvasControls(
      document.querySelector("#accessible-controls")!,
      app.ui.buttons,
      420,
      app.height,
      (id) => app.action(id),
    );
    const phase = app.game.phase;
    reportGameState(
      phase === "playing"
        ? "playing"
        : phase === "paused"
          ? "paused"
          : phase === "menu"
            ? "menu"
            : "result",
    );
    document.querySelector("#game-status")!.textContent =
      phase === "menu"
        ? "飞机大战，选择模式和难度后起飞"
        : phase === "playing"
          ? `得分 ${app.game.score}，生命 ${app.game.player.lives}，火力 ${app.game.player.weapon} 级`
          : phase === "cleared"
            ? "守卫已击败，可以进入下一关"
            : phase === "paused"
              ? "飞行已暂停"
              : "飞行结束，可以再次起飞";
  };
  app.onUIChange = update;
  update();
  window.addEventListener("pagehide", (event) => {
    if (!event.persisted) app.dispose();
  });
  if (new URLSearchParams(location.search).get("qa") === "1")
    Object.assign(window, {
      __PLANE__: {
        app,
        snapshot: () => app.game.summary(),
        action: (id: string) => app.action(id),
        advance: (ticks: number, input = {}) => app.advance(ticks, input),
      },
    });
} catch (error) {
  console.error(error);
  document.querySelector<HTMLElement>("#boot-error")!.hidden = false;
}
