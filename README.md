# 开局游戏厅 · Game Collection

多个独立小游戏的源码、Vue 3 + Vite + TypeScript 大厅和统一发布工程。手机优先、电脑自适应；pnpm Workspaces 管理全部项目，仅根目录维护锁文件。

**在线大厅：https://awaity.github.io/game-collection/**

| 游戏 | 在线入口 | 共用技术 | 构建目标 |
| --- | --- | --- | --- |
| 无尽长夜 | [提灯](https://awaity.github.io/game-collection/games/endless-night/) | Cocos Creator 3.8.8 + TypeScript + Rapier | Web / 微信 / 抖音 |
| 雪原小营 | [经营](https://awaity.github.io/game-collection/games/frost-trail/) | Cocos Creator 3.8.8 + TypeScript | Web / 微信 / 抖音 |
| 电涌小队 | [蓄能](https://awaity.github.io/game-collection/games/surge-squad/) | Cocos Creator 3.8.8 + TypeScript | Web / 微信 / 抖音 |
| 最后一道门 | [突围](https://awaity.github.io/game-collection/games/final-door/) | Cocos Creator 3.8.8 + TypeScript | Web / 微信 / 抖音 |
| 花园守卫 | [种植](https://awaity.github.io/game-collection/games/garden-guard/) | TypeScript + Canvas 2D | Web / 微信 / 抖音 |
| 飞机大战 | [起飞](https://awaity.github.io/game-collection/games/plane-battle/) | TypeScript + Canvas 2D | Web / 微信 / 抖音 |
| 尸潮防线 | [守线](https://awaity.github.io/game-collection/games/zombie-lane/) | TypeScript + Canvas 2D | Web / 微信 / 抖音 |
| 弹幕小队 | [出击](https://awaity.github.io/game-collection/games/volley-run/) | JavaScript + Three.js r140 | Web / 微信 / 抖音 |

八款游戏均提供独立原生小游戏 `game.js` 工程。平台包纳入构建和无 DOM 模拟宿主验证；四款复杂游戏由官方 Cocos Creator 导出，弹幕小队使用实际 WebGL 和本地 GLB 模型。**官方微信／抖音开发者工具、真机和平台审核尚未完成**，具体范围见 [验证记录](docs/MULTIPLATFORM-VERIFICATION.md)。网页发布不代表小游戏已上线平台。

五款游戏新增独立金币、签到、每日任务、成就、五套皮肤和三项永久强化。无尽模式提供双倍击破金币与波次奖金。具体内容与存档规则见 [本轮扩展说明](docs/EXPANSION-2026-10.md)。

## 目录与边界

```text
apps/portal/                  Vue 3 + Vite + TS 大厅
games/endless-night/           无尽长夜，四角色、五烽火与守夜人试炼
games/frost-trail/             雪原小营，采集生产、扩张与四种终局
games/surge-squad/             电涌小队，六地图、充能激光与无尽接战
games/final-door/              最后一道门，六路线、无尽接战与成长回放
games/garden-guard/            花园守卫，二十四关、十二种挑战与全植物无尽
games/plane-battle/            飞机大战，共享规则、Canvas、UI 与三端入口
games/zombie-lane/             尸潮防线，共享规则、Canvas、UI 与三端入口
games/volley-run/              弹幕小队，共享模拟、Three 场景、本地模型
packages/platform/            输入、时钟、安全区、存储、音频、二进制资源
packages/cocos-runtime/       共用 Creator 视图、输入与语义 Web 控件
packages/build-tools/         三端打包、官方 Creator、分包与 WASM 校验
toolchains/cocos.json         Creator 版本、来源校验与平台名称
catalog/games.json            入口、介绍、操作、实机封面
catalog/build-targets.json    各游戏工作区、Web 输出、必需资源、原生目标
shared/browser-navigation.js Web 游戏显式状态驱动的返回大厅入口
scripts/                      统一构建、验证、预览、发布
dist/site/                    完整静态站点（不提交源码分支）
```

大厅不加载游戏引擎；游戏核心不引用 DOM、`wx` 或 `tt`。平台能力经适配器注入。微信、抖音工程不依赖网页大厅、WebView 或 WXML 小程序页面。架构、平台差异与 AppID 说明见 [三端工程说明](docs/PLATFORMS.md)。

## 开发与验证

需要 Node.js **22.14+**、pnpm **11.23.0**。完整构建还需官方 **Cocos Creator 3.8.8**，支持 Windows、macOS 或启用 Windows interop 的 WSL，详见 [安装与构建](docs/COCOS.md)。以下命令在根目录执行。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm cocos:install            # Windows / WSL：安装并校验官方 Creator
pnpm exec playwright install --with-deps chromium  # 首次浏览器验证
pnpm dev                      # 大厅 :4190
pnpm dev:garden-guard          # 花园守卫 :4290
pnpm dev:plane-battle          # 飞机大战 :4192
pnpm dev:zombie-lane           # 尸潮防线 :4180
pnpm dev:volley-run            # 弹幕小队 :4273
```

每条开发命令独立启动对应项目。大厅开发预览仅提供大厅；完整跳转、刷新与返回流程使用 `pnpm build && pnpm preview`，地址为 `http://localhost:4191/game-collection/`。

```bash
pnpm build          # 大厅 + 全部 Web 游戏，聚合到 dist/site
pnpm build:mini     # 读取 catalog，构建所有微信 / 抖音工程
pnpm check          # 发布前统一检查（含真实浏览器和原生宿主）
```

`pnpm check` 包含类型检查、规则/回归测试、静态资源与子路径检查、全部原生构建、触控/生命周期宿主验证、手机与桌面的网页流程检查。自动浏览器测试自行启动并在 `finally` 中关闭预览服务；手工启动的开发或预览服务在验证完成后也应关闭。截图与报告写入 `artifacts/`。

可单独执行 `pnpm test`（先构建 Web）、`pnpm verify:mini`（先构建原生）和 `pnpm verify:web`（先构建 Web）。CI 在 Windows 节点安装官方 Creator 和 Chromium 后运行同一套检查，归档完整站点、全部原生包及验证证据。

原生输出：`games/<slug>/dist/weixin/`、`games/<slug>/dist/douyin/`。Web 输出为 `dist/web/`，弹幕小队保留 Sites 所需的 `dist/client/`，统一聚合过程读取 catalog 处理差异。

## 发布

源码放在 `main`，完整静态站点放在 `gh-pages`。仅根目录可以发布，防止子游戏覆盖其他入口。

```bash
git push origin main
pnpm run deploy
```

发布命令重新运行全部检查，要求工作区干净、站点版本等于 HEAD；在发布提交和 `release.json` 中记录源码 SHA，并保留 `gh-pages` 历史。GitHub Pages 配置为 **Deploy from a branch → gh-pages → / (root)**。微信与抖音的工程导入、真机测试和发布是各平台独立流程。

## 新增游戏

1. 在 `games/<slug>/` 新建工作区，提供 `build`、`test`、`build:weixin`、`build:douyin`；复用共享平台和构建包。
2. 在 `catalog/games.json` 登记介绍、操作和实机封面，在 `catalog/build-targets.json` 登记 Web 路径、资源和两种 `miniTargets`。构建与测试自动遍历目录。
3. Web 入口调用 `reportGameState('menu' | 'playing' | 'paused' | 'result')`，控制聚合站点的返回按钮。
4. 为真实浏览器／原生宿主加入该游戏的交互场景，更新根锁文件并执行 `pnpm check`。

所有游戏都必须具备三端目标；复杂新增游戏使用 Cocos Creator 3.8 LTS + TypeScript，并锁定官方补丁版本。先验证可运行的极简闭环，再迭代到完整参考玩法、画面和交互；极简版不能代替最终验收。后续登录、广告、排行榜等功能放在平台服务层。

## 文档

- [无尽长夜说明](games/endless-night/README.md) · [雪原小营说明](games/frost-trail/README.md)
- [电涌小队说明](games/surge-squad/README.md) · [最后一道门说明](games/final-door/README.md)
- [官方 Cocos 工具链](docs/COCOS.md) · [参考画面对照](design-qa.md)
- [花园守卫说明](games/garden-guard/README.md) · [迁移记录](games/garden-guard/docs/MIGRATION.md)
- [飞机大战说明](games/plane-battle/README.md) · [上游来源与修正范围](games/plane-battle/PROVENANCE.md)
- [尸潮防线说明](games/zombie-lane/README.md)
- [弹幕小队说明与模型来源](games/volley-run/README.md)
- [三端工程与 AppID](docs/PLATFORMS.md) · [本轮验证记录](docs/MULTIPLATFORM-VERIFICATION.md)
- [大厅设计依据](docs/PORTAL-DESIGN.md) · [早期工作区迁移记录](docs/VERIFICATION.md)
