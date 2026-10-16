# 花园守卫

独立创建的植物大战僵尸玩法复刻，位于 `games/garden-guard/`。采用五行九列草坪、阳光经济、种子冷却、分路攻击和一次性割草机，手机竖屏优先，同时适配电脑和手机横屏。

角色、场景和音效由代码绘制、合成；不需要下载原作资源。TypeScript + Canvas 2D，游戏运行时没有第三方依赖。浏览器、微信小游戏、抖音小游戏共用完整的战斗、菜单、图鉴和存档逻辑，小游戏通过原生 Canvas 运行。

## 游玩内容

- **关卡模式**：三章十二关，包括白天、夜晚与薄雾，逐关解锁并保存最高星级。保留全部割草机可得三星。
- **冒险模式**：连续五场战斗；每场胜利选择强化，升级影响后续战斗。保存当前场的出发点和已获得升级，失败可以重试，离开后可以继续。
- **挑战模式**：阳光精算师（固定预算）、极速尸潮、坚果保卫队（没有割草机）、无尽守卫；分别记录最佳成绩。
- **八种植物**：向日葵、豌豆射手、坚果墙、樱桃炸弹、寒冰射手、双发射手、土豆地雷、小喷菇。
- **六种僵尸**：普通、路障、铁桶、疾跑、读报和巨人。
- 植物与僵尸图鉴、2 倍速、铲子、自动收集阳光选项、静音、减少动态效果、暂停与重开、切后台自动暂停。

这是一套完整可玩的独立玩法实现，关卡内容和视觉素材为本项目重新制作；不包含原作全部植物、泳池、屋顶、商店或剧情。

## 本地运行

需要 Node.js 22 或更新版本。在本文件所在目录执行：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

浏览器打开 <http://localhost:4290/>。手机与电脑在同一局域网时，打开开发服务器输出的 Network 地址。

## 操作

触屏或鼠标：先点种子卡，再点草坪种植；点金色阳光收集。左上角的阳光计数可以一次收集全部阳光。右上角暂停，底部铲子、倍速和玩法提示。

键盘：`1–8` 选择对应植物，方向键选择格子，`Enter` 种植／铲除，`S` 收集全部阳光，`X` 切换铲子，空格暂停／继续，`Esc` 返回／关闭弹窗。菜单也支持 Tab 焦点与 Enter 点击。

新手可以先种几株向日葵，再为每行补一株射手。夜晚没有天降阳光，需要扩大向日葵阵列；地雷需要 9 秒准备，适合提前埋伏。

## 构建与检查

```bash
pnpm test                 # 规则、实战策略、状态流、存档、布局和平台适配
pnpm build:all        # 类型检查 + Web + 微信 + 抖音
pnpm verify:mini      # 在无 DOM 模拟宿主中启动两个实际构建包
pnpm exec playwright install chromium  # 浏览器自动化首次使用时安装
pnpm verify:web       # 自动启动生产预览，验证触控、键盘和完整玩法流程
```

精简 Linux / WSL 环境可能缺少 Chromium 系统库，可按 Playwright 提示安装依赖（`pnpm exec playwright install-deps chromium`）；这只影响自动化浏览器，正常开发与构建不依赖该步骤。

| 命令 | 输出 | 用途 |
| --- | --- | --- |
| `pnpm build` | `dist/web/` | 静态网站，可部署到任意静态服务器及子目录 |
| `pnpm build:weixin` | `dist/weixin/` | 可导入微信开发者工具的小游戏工程 |
| `pnpm build:douyin` | `dist/douyin/` | 可导入抖音开发者工具的小游戏工程 |
| `pnpm preview` | <http://localhost:4291/> | 本地预览 Web 生产包 |

小游戏构建支持设置自己的 AppID：

```bash
GARDEN_GUARD_WEIXIN_APP_ID=你的微信小游戏AppID pnpm build:weixin
GARDEN_GUARD_DOUYIN_APP_ID=你的抖音小游戏AppID pnpm build:douyin
```

未设置时，微信使用 `touristappid`，抖音留空；导入工具时填写自己的 AppID。工程包包含 `game.js`、`game.json`、`project.config.json` 和本地 WAV 音效，使用竖屏方向与平台安全区域。

平台导入、兼容边界与真机验收说明见 [docs/PLATFORMS.md](docs/PLATFORMS.md)，验证证据见 [docs/VERIFICATION.md](docs/VERIFICATION.md)。已完成代码和构建包验证；官方开发者工具与真机验收需要对应工具、AppID 和设备，本工程尚未发布到平台。

## 源码

```text
src/core/content.ts     植物、敌人、关卡、挑战与冒险强化
src/core/game.ts        与平台无关的战斗模拟
src/core/save.ts        存档校验、星级解锁、挑战与冒险纪录
src/app.ts              状态流、固定步长循环、输入与暂停
src/render/             全部游戏 UI、地图、人物与场景
src/platform/           浏览器 / wx / tt 的输入、存储、声音和生命周期
src/web.ts              浏览器入口及 QA 开关
src/mini.ts             原生小游戏入口
scripts/build-mini.ts   小游戏打包与 WAV 生成
scripts/verify-web.ts   生产包浏览器验证
tests/                  自动化验证与不修改游戏资源的实战策略
```

存档键为 `garden-guard.save.v1`，浏览器使用 localStorage，小游戏使用平台本地存储；三端独立保存。进行中的战场不保存，冒险保存关卡起点。清理浏览器／平台应用数据会清除记录。

开发或生产地址加 `?qa=1` 才会暴露 `window.__GARDEN__`，用于测试推进真实模拟；普通地址没有全局调试入口。QA 会写本地存档，自动化验证使用独立浏览器上下文。
