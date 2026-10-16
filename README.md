# 开局游戏厅 · Game Collection

多个独立小游戏的源码、游戏大厅与统一发布工程。大厅采用 Vue 3 + Vite + TypeScript，手机单列、电脑双列；游戏按目录独立开发和构建，通过同一个 GitHub Pages 站点游玩。

**在线大厅：https://awaity.github.io/game-collection/**

| 游戏 | 在线入口 | 实现与平台 |
| --- | --- | --- |
| 尸潮防线 | [开始游戏](https://awaity.github.io/game-collection/games/zombie-lane/) | TypeScript + Canvas 2D；Web、微信、抖音入口 |
| 弹幕小队 | [开始游戏](https://awaity.github.io/game-collection/games/volley-run/) | JavaScript + Three.js；Web |

微信、抖音目前提供尸潮防线的原生小游戏构建和模拟宿主测试，尚未完成官方开发者工具、真机与平台审核。弹幕小队保持原有 Web 实现，后续移植需单独评估。

## 目录

```text
apps/portal/                 Vue 游戏大厅
games/volley-run/             弹幕小队及本地模型、Three.js
games/zombie-lane/            尸潮防线、共享游戏层与 Web / wx / tt 适配器
catalog/games.json           大厅展示内容和游戏入口标识
catalog/build-targets.json   各游戏的工作区名称、Web 产物路径、必需资源
shared/browser-navigation.js 聚合 Web 发布时添加的返回大厅入口
scripts/                    全站构建、检查、预览和发布
tests/                      目录与实际静态站点集成检查
pnpm-lock.yaml              全工作区唯一依赖锁文件
dist/site/                  完整静态发布产物（不提交源码分支）
```

大厅不导入游戏代码或引擎。每个游戏保留自己的依赖、测试和产物；微信、抖音工程不引用 Vue、大厅或网页返回导航。

## 开发

需要 Node.js **22.14+**，推荐 Node.js 22 LTS；仓库固定 pnpm **11.23.0**。所有命令默认在仓库根目录执行。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev                 # 大厅：http://localhost:4190/
pnpm dev:volley-run      # 弹幕小队：http://localhost:4273/
pnpm dev:zombie-lane     # 尸潮防线：http://localhost:4180/
```

三个开发服务器分别启动。大厅开发服务器只预览大厅；检查完整的游戏跳转流程请使用下面的聚合预览。

```bash
pnpm build
pnpm preview
```

聚合预览：http://localhost:4191/game-collection/ 。预览服务器使用与线上相同的子路径，支持直达游戏、刷新、目录跳转和真实 404。

依赖统一从根目录安装；为单个项目添加依赖使用 `pnpm --filter <项目名> add <包名>`。不在子目录维护额外锁文件。

## 构建与检查

```bash
pnpm check
```

依次执行大厅类型检查、三个 Web 项目构建、两个游戏测试、聚合站点集成检查，以及尸潮防线微信 / 抖音构建和实际打包文件的模拟宿主检查。游戏测试和站点测试使用构建产物，单独运行 `pnpm test` 前先执行 `pnpm build`。

`pnpm build` 将大厅放入 `dist/site/`，游戏放入 `dist/site/games/<slug>/`，复制完整静态资源并生成 `.nojekyll`、`404.html`、`release.json`。仅在聚合 Web 产物中注入返回游戏厅入口，在战斗中隐藏、菜单中显示。游戏规则、原有模型和运行资源保持独立。

GitHub Actions 在 `main` 推送和 PR 时运行同一组检查，并保存完整站点及两个小游戏工程包作为构建产物。

## 发布

源码放在 `main`，完整静态站点放在 `gh-pages`。**仅根目录负责发布**，子游戏没有独立部署命令，避免覆盖大厅或其他游戏。

提交并上传源码后，在已登录 GitHub、且 `origin` 指向本仓库的环境执行：

```bash
git push origin main
pnpm run deploy
```

命令重新运行全部检查，然后使用 `gh-pages` 包发布 `dist/site/`。发布要求工作区干净、产物版本与当前 HEAD 一致，并在发布提交与 `release.json` 中记录源码版本；保留 `gh-pages` 历史。

GitHub Pages 设置为 **Deploy from a branch → gh-pages → / (root)**。当前 CI 负责验证和产物归档；发布由上述命令显式触发。检查线上 `release.json` 可确认新版本已生效。

## 新增游戏

1. 在 `games/<slug>/` 创建独立工作区，提供 `build` 和项目自身的测试命令；Web 资源使用相对路径。
2. 向 `catalog/games.json` 添加名称、真实截图、介绍和操作说明；截图放在 `apps/portal/public/covers/`。
3. 在 `catalog/build-targets.json` 登记工作区名称、Web 输出目录和必需资源。需要返回导航的新 UI，在 `shared/browser-navigation.js` 添加对应的菜单状态判断。
4. 将新游戏的检查加入根目录命令，运行 `pnpm install` 更新唯一锁文件，再执行 `pnpm check` 和聚合预览。

游戏大厅入口和聚合构建自动读取同一份游戏目录。新增平台能力应通过各游戏的平台适配层实现，避免游戏核心依赖网页 DOM、`wx` 或 `tt`。

## 项目文档

- [弹幕小队说明与资源来源](games/volley-run/README.md)
- [尸潮防线说明](games/zombie-lane/README.md)
- [微信 / 抖音架构与后续上线](games/zombie-lane/docs/PLATFORMS.md)
- [大厅设计依据](docs/PORTAL-DESIGN.md)
- [工作区迁移验证](docs/VERIFICATION.md)
