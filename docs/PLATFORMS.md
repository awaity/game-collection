# 全部游戏的三端工程

每款游戏对应一个独立微信小游戏和一个独立抖音小游戏工程。浏览器集合页仅负责展示与跳转，不能作为原生小游戏的外壳。

## 共享代码

- `packages/platform`：Web / Mini 输入、触点 ID 与取消、可见性、安全区/DPR、存储容错、合成音效、原生本地文件读取；固定时钟和 Web 语义控件也是独立子路径导出，原生入口不导入浏览器代码。
- `packages/build-tools`：简单游戏使用 esbuild 打包 `game.js`、配置与本地音频；Cocos 工程调用官方 Creator 3.8.8 CLI 导出。超过 4 MiB 的保守主包/分包预算或 20 MiB 总包预算时终止构建。
- `packages/cocos-runtime`：最后一道门、电涌小队、雪原小营、无尽长夜共用 Creator 视图、输入与平台服务；各自保留独立规则、场景和素材。小游戏使用官方平台适配器，详情见 [Cocos 工具链](COCOS.md)。无尽长夜按公共资源、六场景、音频和物理 WASM 分包。
- 飞机大战与尸潮防线复用各自的 Canvas 渲染、菜单与规则。尸潮旧 `src/platform/*` 只作为兼容导出，实际实现来自共享包。
- 花园守卫的 `canvas-host` / `canvas-web` / `canvas-mini` 通用适配器位于共享平台包。保留原有九种音色、存储失败提示与语义控件；核心规则和 12 关内容原样迁移。
- 弹幕小队复用原战斗模拟、三条路线、五个 GLB 和 Three 场景。`render/web-runtime.js` / `mini-runtime.js` 注入画布、尺寸、纹理画布工厂和二进制读取；使用 `GLTFLoader.parseAsync`，原生不经过 fetch。原生菜单绘制到离屏 Canvas，再合成为同一 WebGL 画布的覆盖层。

Web 和原生的存档空间相互独立，各游戏也使用独立命名空间。没有跨设备云存档。

## 原生端差异

| 项目 | Web | 微信 / 抖音 |
| --- | --- | --- |
| 输入 | PointerEvent、键盘、语义按钮 | 原生触控及触点取消 |
| 存档 | localStorage | getStorageSync / setStorageSync |
| 音效 | Web Audio / Creator AudioSource | 本地 WAV / MP3，InnerAudioContext 或 Creator 适配器 |
| 模型 | 相对路径 fetch → ArrayBuffer | 文件系统 readFile → ArrayBuffer |
| 生命周期 | visibilitychange / blur | onHide 自动暂停，onShow 后手动继续 |
| 大厅导航 | Web 入口报告状态 | 每款游戏自己的菜单，无网页大厅 |
| 弹幕小队画质 | 精细／均衡／轻量 | 默认轻量，具备深度纹理支持时可选均衡 |
| 弹幕小队回放 | 文件导入／导出、演示 | 演示，最近一局回放存于本地；暂无文件导入／导出 UI |
| 最后一道门回放 | 文件导入／导出、挑战链接 | 原生剪贴板导入／导出及挑战链接 |
| Cocos 资源 | 本地 Asset Bundle | 平台文件系统与代码分包，Creator AssetManager |
| 无尽长夜物理 | 本地 Rapier WASM / WebAssembly | 静态代码分包 / WXWebAssembly、TTWebAssembly |

Three r140 保留原版引擎和许可证。打包时仅对该库局部提供 `navigator` 能力探测值、UTF-8 解码回退和 Canvas 事件兼容接口，没有全局 DOM 模拟器。当前 GLB 没有图片、纹理 URI、压缩扩展或外部 buffer；**后续增加这些资源不能直接假定兼容**，需要补充对应的原生加载器和验证。小游戏包不加载远程脚本或动态代码。

## AppID 与导入

使用每游戏、每平台独立变量，避免不同游戏误用同一个 AppID：

| 游戏 | 微信 | 抖音 |
| --- | --- | --- |
| 无尽长夜 | `ENDLESS_NIGHT_WEIXIN_APP_ID` | `ENDLESS_NIGHT_DOUYIN_APP_ID` |
| 雪原小营 | `FROST_TRAIL_WEIXIN_APP_ID` | `FROST_TRAIL_DOUYIN_APP_ID` |
| 电涌小队 | `SURGE_SQUAD_WEIXIN_APP_ID` | `SURGE_SQUAD_DOUYIN_APP_ID` |
| 最后一道门 | `FINAL_DOOR_WEIXIN_APP_ID` | `FINAL_DOOR_DOUYIN_APP_ID` |
| 花园守卫 | `GARDEN_GUARD_WEIXIN_APP_ID` | `GARDEN_GUARD_DOUYIN_APP_ID` |
| 飞机大战 | `PLANE_BATTLE_WEIXIN_APP_ID` | `PLANE_BATTLE_DOUYIN_APP_ID` |
| 尸潮防线 | `ZOMBIE_LANE_WEIXIN_APP_ID` | `ZOMBIE_LANE_DOUYIN_APP_ID` |
| 弹幕小队 | `VOLLEY_RUN_WEIXIN_APP_ID` | `VOLLEY_RUN_DOUYIN_APP_ID` |

```bash
PLANE_BATTLE_WEIXIN_APP_ID=你的AppID pnpm --filter plane-battle build:weixin
PLANE_BATTLE_DOUYIN_APP_ID=你的AppID pnpm --filter plane-battle build:douyin
```

也可以在环境中设置所有变量后运行 `pnpm build:mini`。构建读取进程环境变量；不会自动加载 `.env`。不设置时微信使用 `touristappid`，抖音留空，`build-info.json` 或 `creator-build.json` 记录是否配置 AppID，不能用占位值直接发布。

将 `games/<slug>/dist/weixin/` 或 `dist/douyin/` 作为工程根目录导入官方开发者工具；其中包含 `game.js`、`game.json`、`project.config.json`。简单游戏包含 `audio/`，弹幕小队另含本地模型和 Three 许可证；Creator 工程包含引擎、assets 和按需 subpackages。工程 `compileType` 为 `game`。

## 验证边界与下一阶段

`pnpm check` 的 Worker 宿主没有 `window/document`，阻断 bundle 的网络 fetch，实际运行产物、模型和 Canvas/WebGL。它证明共享代码能在该受控环境运行，不能证明微信/抖音全部客户端版本和 GPU 均兼容。

获得真实 AppID 和开发者权限后，分别在官方工具及 iOS/Android 真机检查：字体/Canvas 阴影、WebGL1/2 与扩展、模型/纹理上传、低端设备帧率与内存、首次音频解锁、后台音频停止、安全区、来电中断、长期运行、上下文丢失恢复。原生 Canvas 未提供 context lost/restored 事件的宿主需单独验证恢复策略。官方平台上传、审核和发布还没有执行。

本版没有登录、广告、支付或网络排行榜。后续引入时由平台层提供能力，并单独测试平台回调与失败路径。

官方参考：[微信小游戏 Canvas](https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createCanvas.html)、[抖音小游戏 Canvas](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/render/canvas/tt-create-canvas)。
