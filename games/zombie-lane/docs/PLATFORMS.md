# 三端架构与后续上线

## 选型依据

本轮交付是固定斜俯视的单场景射击游戏，玩法需要的是左右走位、子弹命中、几十个同屏敌人和射击反馈。使用 TypeScript + Canvas 2D 做 2.5D 投影，能以一套源码覆盖浏览器、微信小游戏和抖音小游戏。运行时不加载框架或美术资源。

这是一项有边界的选型：固定镜头的当前玩法适合 Canvas。若后续变成可旋转的真实 3D 世界、复杂骨骼动画或大量关卡编辑，应重新评估 Cocos Creator 3.8 LTS 等带场景编辑器和官方小游戏导出的引擎。纯 TypeScript 的战斗核心可沿用，渲染层需替换。当前没有把它宣称为 Cocos 工程或完整 3D 引擎。

## 共用与平台差异

| 能力 | 共用实现 / Web | 微信 / 抖音 |
| --- | --- | --- |
| 战斗、关卡、随机种子 | `src/core/game.ts`；固定 60 Hz，纯数据 | 完全相同 |
| 战场、角色、按钮、结算 | `src/render`，Canvas 2D | 完全相同，使用 `wx/tt.createCanvas()` |
| 动画帧 | `requestAnimationFrame`，固定步长累积器 | 平台全局 `requestAnimationFrame` |
| 输入 | Web PointerEvent + 键盘 | `onTouchStart/Move/End/Cancel`，保留触点 ID |
| 后台暂停 | `visibilitychange` / `blur` | `onHide` / `onShow`；回前台不自动开战 |
| 持久化 | `localStorage` | `getStorageSync` / `setStorageSync` |
| 声音 | Web Audio 合成缓冲 | 相同采样生成的本地 WAV + InnerAudioContext |
| 布局 | 容器尺寸、系统安全区、DPR ≤ 2 | window 信息、胶囊按钮避让、安全区、DPR ≤ 2 |
| 震动 | 可无震动游玩 | 防线告急时可选 `vibrateShort` |
| 无障碍 | Web 语义按钮与状态播报 | 当前游戏 Canvas 操作 |

共享游戏层只接收 `Platform`，不引用 `document`、HTML 元素、浏览器音频类、`wx` 或 `tt`。两个小游戏产物分别打入对应平台常量，不安装浏览器 DOM 兼容层。

## 包与资源

每个平台输出 `game.js`、`game.json`、`project.config.json` 及 8 段本地 WAV。初始包小于 1 MB；当前不需要分包/CDN。正式增加图片、模型、配音后，应重新测首包与内存并设计分包。

美术和音效均由本项目代码生成，没有从先前项目、商业游戏或广告提取素材。游戏名称为本项目独立名称「尸潮防线」。

## 已完成与待做

已完成：浏览器可玩、三端入口、平台接口实现、后台暂停、触控取消、存档降级、音频降级、像素比限制、真实三端构建、无 DOM 宿主启动测试。

后期上线时需要：

1. 使用真实小游戏 AppID 导入各自官方开发者工具，检查控制台与本地音效。
2. iOS / Android 真机验证 Canvas 字体、阴影与图集、DPR、安全区、首次点按解锁音频、后台音频中止、切回继续、长时间性能和内存。模拟宿主测试不能代替这些检查。
3. 确定是否需要登录、云存档、排行榜或激励广告；只在平台服务层增加接口，不把登录/广告 API 写进战斗逻辑。
4. 若加入广告奖励，依据平台实际成功回调发放奖励，处理取消与失败；本版无广告或付费机制。
5. 准备平台要求的主体信息、游戏备案/内容材料、隐私声明、图标与截图，再按平台流程提交审核。

这份列表属于后续发布阶段，本轮没有声称已经上传、过审或完成真机适配。

## 官方接口参考

- 微信 Canvas：[微信开放文档](https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createCanvas.html)
- 抖音 Canvas：[抖音开放平台](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/render/canvas/tt-create-canvas)
- 复杂 3D 扩展时的候选：[Cocos Creator 微信发布](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)、[抖音发布](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-bytedance-mini-game.html)
