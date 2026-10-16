# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `pnpm --filter volley-run build` and `pnpm --filter volley-run test:sites` from the repository root; the build must leave this game's `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Git 提交信息使用 `type(scope): 中文描述`。本游戏已迁入 `awaity/game-collection` 的 `games/volley-run/`，遵守根目录 AGENTS.md。统一使用 pnpm 与根目录锁文件。仅根目录 `pnpm run deploy` 发布完整 `dist/site`；子游戏不得单独覆盖 gh-pages。迁移保持现有战斗规则与模型不变。

原生小游戏已加入：World 场景通过 render/*-runtime.js 注入画布、资源与尺寸，不得重新引入直接 DOM 依赖。保留现有三条路线的确定性结果及五个本地模型，原生 UI 在同一个 WebGL 画布上合成。
