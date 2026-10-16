# 尸潮防线

从零创建的独立小游戏，位于 pnpm 工作区的 `games/zombie-lane/`，源码与 `../volley-run` 分开。

在线游玩：https://awaity.github.io/game-collection/games/zombie-lane/

广告里的玩法做成真实游戏：单个持枪角色左右移动，左移射击武器门，右移自动攻击僵尸。门被子弹击破后立即获得升级。僵尸越过底部防线会扣血，击败最终尸王才会通关。

## 当前可玩内容

- 2.5D 城市高架、单人角色、三波尸潮、疾跑者、重装僵尸和尸王。
- 双发子弹、伤害增强、六管加特林、范围火炮和防线修复。
- 空袭每 28 秒可用一次；连击、命中特效、枪声和结算音效。
- 标准 / 硬核两种难度；暂停、重开、操作说明、独立难度的本地最佳分数。
- 鼠标 / 手机左右拖动，A / D 或方向键移动，E 空袭，空格暂停，R 重试。
- 浏览器失去焦点或小游戏切到后台时自动暂停，回到前台后由玩家点击继续。

## 技术栈

TypeScript + Canvas 2D（2.5D 投影）+ Vite / esbuild。运行时零第三方依赖。

**游戏逻辑、渲染、游戏 UI、命中与触控规则三端共用**；平台层接 Web / 微信 `wx` / 抖音 `tt`。网页侧栏是浏览器专用外壳，不参与游戏。小游戏是原生 Canvas 入口，不通过 WebView 加载网页。

人物图集在启动时本地绘制；音效来自程序合成，小游戏构建时生成 WAV。无需联网下载模型、字体、图片或音效。上限 90 个敌人、160 发子弹和 350 个特效粒子，像素比最高为 2。

架构与上线准备见 [docs/PLATFORMS.md](docs/PLATFORMS.md)，验证范围见 [docs/VERIFICATION.md](docs/VERIFICATION.md)。

## 本地开发

Node.js 22.14+、pnpm 11.23.0。以下命令在仓库根目录执行，依赖与唯一锁文件由工作区管理。

```bash
pnpm install --frozen-lockfile
pnpm dev:zombie-lane
```

开发预览：<http://localhost:4180/>。同一局域网手机可以访问终端显示的 Network 地址。

## 构建与验证

```bash
pnpm --filter zombie-lane test
pnpm --filter zombie-lane build:all
pnpm --filter zombie-lane verify:mini
pnpm --filter zombie-lane preview
```

| 命令 | 输出 |
| --- | --- |
| `pnpm --filter zombie-lane build` | `dist/web/`，浏览器静态站点 |
| `pnpm --filter zombie-lane build:weixin` | `dist/weixin/`，微信小游戏工程 |
| `pnpm --filter zombie-lane build:douyin` | `dist/douyin/`，抖音小游戏工程 |
| `pnpm --filter zombie-lane build:all` | 构建以上三个目标；Web 构建前执行类型检查 |
| `pnpm --filter zombie-lane verify:mini` | 在没有 DOM 的模拟宿主中启动两个实际小游戏包，触控进入战斗，检查音效文件 |

表中输出路径相对于本游戏目录。生产包预览：<http://localhost:4181/>。`dist/web` 的资源使用相对路径，支持子目录。

GitHub Pages 由仓库根目录的 `pnpm run deploy` 统一发布大厅和所有游戏，本游戏不单独部署。完整站点预览使用根目录的 `pnpm build`、`pnpm preview`，详见[仓库说明](../../README.md)。

微信 / 抖音构建可通过环境变量注入 AppID：

```bash
WEIXIN_APP_ID=你的微信小游戏AppID pnpm --filter zombie-lane build:weixin
DOUYIN_APP_ID=你的抖音小游戏AppID pnpm --filter zombie-lane build:douyin
```

构建完成后，将对应目录导入平台开发者工具。未提供 AppID 时，微信使用开发占位值，抖音留空，不能据此直接发布。

## 源码结构

```text
src/core/game.ts        纯 TypeScript 固定步长战斗模拟
src/render/            Canvas 场景、图集、特效和全部游戏 UI
src/app.ts             输入、生命周期、固定步长循环与界面协调
src/platform/types.ts  平台接口
src/platform/web.ts    Web Canvas、PointerEvent、Web Audio、localStorage
src/platform/mini.ts   wx / tt Canvas、触控、音频、存储与后台事件
src/web.ts             浏览器启动和可访问性控件
src/mini.ts            微信 / 抖音原生启动入口
scripts/build-mini.ts  打包工程配置和本地音效
tests/                 规则、全关卡、适配器与渲染回归检查
```

开发与构建后的 Web 地址加 `?qa=1` 才会暴露验证接口 `window.__ZOMBIE__`。它可以推进真实模拟以验证结算和渲染，常规地址不暴露此入口。使用 QA 仍会写入当前浏览器的本地纪录；测试后可清除 `zombie.records.v1`。

当前未接登录、广告、支付、排行榜或服务器。浏览器版已完成可玩与构建验证；微信和抖音已提供适配层及可导入工程包，尚未在官方开发者工具和真机上验收。
