# 开局游戏标识与入场

原创标识由门形笔画和播放三角组成。标准矢量为 `shared/brand/mark.svg`；大厅、favicon、Web 启动层使用该标识，原生渲染使用 `packages/platform/src/brand.ts` 的同一坐标。名称统一为「开局游戏」。

Web 的 HTML 内联标识、样式和入场脚本，避免先出现旧引擎标志。只有 `reportGameState` 报告有效菜单/对局状态后才允许揭幕；无虚构进度。就绪后约 850ms 自动播放开门效果，可点击按钮或 Enter/空格/Esc 跳过，系统减少动态时缩短为 120ms。加载失败或准备超过 15 秒提供重新加载和返回大厅。

入场期间背景元素 `inert`，新增的游戏控件也被隔离；焦点留在入场操作中。完成后恢复原有 `inert` 状态并把焦点交回游戏画布。跨越揭幕的按键和触摸不会触发底层开始、移动或购买。局内重新开始不会重复入场；重新载入页面会再次显示。

Canvas、Three.js 和 Cocos 原生工程共用入场时钟与标识；分别通过 Canvas 帧末覆盖、现有 Three.js UI 纹理、Cocos Graphics 绘制。原生触摸用于跳过，输入适配器消费该次手势。山海的「减少动态」设置也作用于原生入场。

Cocos Creator 3.8.8 官方导出后将 `src/settings.json` 的 splash 设为零时长、无默认 logo；微信还包含独立的 pre-engine 首屏：用共享标识绘制的原生 WebGL 启动模块替换生成的 first-screen.js，抖音启动时接入同模块；不加载旧 logo/slogan 图片，不修改引擎源码。构建来源指纹包含标识、启动脚本及样式。品牌仅由根脚本聚合和发布，保持各游戏独立构建以及 `/game-collection/` 子路径。

验收脚本：

```bash
node scripts/verify-entrance.mjs web
node scripts/verify-entrance.mjs native
```

Web 检查真实九入口、延迟资源、键盘跳过/恢复、原有 inert 保留、加载错误键盘重试、减少动态，以及五款 Cocos 默认 splash 关闭。原生检查全部十八个真实导出的品牌画面与跳过手势隔离。输出位于 `artifacts/entrance/`，两项已纳入根 `pnpm check` 的 Web/原生检查阶段。官方开发者工具与手机真机验证不在模拟宿主的证据范围内。
