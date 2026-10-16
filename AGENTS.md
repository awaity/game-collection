# Game Collection

- 用户确定：同一个 GitHub 仓库存放多个独立小游戏；源码按 `games/<slug>` 区分，所有浏览器产物与游戏大厅一起发布到 `gh-pages`。
- 包管理统一使用 pnpm Workspaces。大厅和全部游戏都使用 pnpm，仅根目录保留 `pnpm-lock.yaml`，禁止新增 npm/yarn 锁文件。
- 大厅位于 `apps/portal`，技术栈 Vue 3 + Vite + TypeScript，移动端优先并适配 PC。
- 用户已授权本轮源码上传与 GitHub Pages 发布。发布前完成本地检查；仅仓库根目录负责全站发布，子游戏不得独立覆盖 gh-pages。
- 游戏介绍读取 `catalog/games.json`；构建路径配置放 `catalog/build-targets.json`。资源和入口必须支持 `/game-collection/` 子路径。
- 不改动现有战斗规则。各游戏保留自己的构建与测试，微信/抖音代码不依赖网页大厅。
- 根目录 `pnpm check` 为发布检查。浏览器检查包含大厅、全部游戏入口、刷新、返回，以及移动端和桌面。
- Git 提交信息使用 `type(scope): 中文描述`。保持原项目历史，发布提交注明源代码 SHA。
- 不读取或输出凭据内容。用户授权发布不代表需要更改其他仓库或平台设置。

- 每款游戏必须提供 Web、微信小游戏、抖音小游戏三个构建目标；平台适配通过 packages/platform，共用打包通过 packages/build-tools。核心规则不直接依赖 DOM、wx、tt。
- 新增飞机大战迁自 awaity/my-game-plane，保留来源提交与玩法。原生工程的构建、模拟宿主、开发者工具、真机验证状态分别记录。
- 验证完成后必须关闭本轮启动的本地服务并确认端口释放。
