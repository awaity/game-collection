# Cocos Creator 工具链

复杂新增游戏使用真正的 **Cocos Creator 3.8.8（3.8 LTS）+ TypeScript**。版本、官方 Windows 下载地址、SHA-256、裁剪模块和平台名称锁定在 `toolchains/cocos.json`。

## 安装与构建

- Windows 或启用 Windows interop 的 WSL：`pnpm cocos:install` 下载并验证官方压缩包，安装在当前用户临时目录，不需要管理员权限。
- macOS：从 Cocos Dashboard 安装 3.8.8；若不是默认位置，用 `COCOS_CREATOR_PATH` 指向 `CocosCreator.app/Contents/MacOS/CocosCreator`。
- 自有 Windows 安装：将 `COCOS_CREATOR_PATH` 指向 `CocosCreator.exe`。WSL 使用 `/mnt/c/.../CocosCreator.exe` 路径。
- 普通 Linux 没有对应的官方 Creator 桌面发行版；必须使用 Windows/macOS 构建节点。不能把单独编译引擎冒充 Creator 工程导出。

```sh
pnpm install --frozen-lockfile
pnpm --filter final-door build
pnpm --filter final-door build:weixin
pnpm --filter final-door build:douyin
pnpm --filter final-door typecheck
pnpm --filter final-door test
```

官方 CLI 读取 JSON 配置，平台分别为 `web-mobile`、`wechatgame`、`bytedance-mini-game`。Creator 3.8.8 的构建成功退出码包括 **36**；构建工具同时检查实际产物入口。每次构建记录版本、来源哈希、平台与执行时间到 `dist/<target>/creator-build.json`；日志保存在游戏的 `artifacts/creator/`。

## 工作区边界

每个游戏保留自己的 `.scene`、`.meta`、TypeScript、设置、规则测试与 `package.json`。共享 Cocos 视图位于 `packages/cocos-runtime`；存档、生命周期及大厅状态契约经过 `packages/platform`；所有 Creator 调用经过 `packages/build-tools`。

构建在缓存工程中进行，共享源码被复制为 `assets/collection`，不提交编辑器生成的 `library`、`temp`、`local`、`profiles` 或构建产物。缓存工程只保留 Creator 必需的清单，不让编辑器在子工程中自动安装 npm 依赖。WSL 下工程放在 Windows 文件系统，避免 Creator 访问 UNC 项目路径的问题。

`COCOS_BUILD_CACHE` 可指定构建缓存根目录；`COCOS_FORCE_BUILD=1` 强制重建。源码、共享模块、平台、版本或 AppID 变化会使产物缓存失效。

## 小游戏

原生工程不使用 WebView 或 Vue 大厅。Creator 自带微信、抖音适配器处理 Canvas、资源、触控与生命周期。游戏规则不读取 DOM、`wx` 或 `tt`。

各游戏使用独立的 `<SLUG>_WEIXIN_APP_ID`、`<SLUG>_DOUYIN_APP_ID` 环境变量，例如 `FINAL_DOOR_WEIXIN_APP_ID`。没有 AppID 的导出用于本地开发，不能声称已通过平台上传审核或真机验证。

引擎按实际使用模块裁剪。主包超过平台预算时须改用平台支持的分包方案；不能为了让检查通过而放宽预算。

构建成功、浏览器执行、原生模拟宿主、平台开发者工具、真机各自单独记录。只有实际执行过的阶段可以标记通过。

## 持续集成与实际运行

根 CI 使用 Windows 构建节点，缓存官方压缩包并重新验证 SHA-256；官方 Creator 导出后运行全站及三端检查。`scripts/pnpm.mjs` 优先使用 pnpm 的 Node 入口，避免 Windows 直接 exec `.cmd` 的兼容问题。

`node scripts/verify-cocos.mjs native` 在 DOM-free Worker 宿主执行真实原生包，包括触控、生命周期、剪贴板、原生音频 API 调用与 WebGL 渲染。`node scripts/verify-cocos.mjs web` 检查文件导入导出、窄屏分页等浏览器交互。检查自身创建的浏览器和临时服务器在 finally 中关闭。

测试标志 `__COLLECTION_TEST__` 提供只读快照和实际规则步进入口，便于捕获相同种子/时刻；它不授予资源或修改胜负条件。生产页面默认不生成每帧状态哈希。
