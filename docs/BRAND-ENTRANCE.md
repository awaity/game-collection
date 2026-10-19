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

## 2026-10-19 验收记录

- Web 九款真实入口与两组加载/输入合约检查通过；覆盖延迟资源、错误恢复、跳过和减少动态。见 `artifacts/entrance/web-verification.json`、`artifacts/brand-entrance-web.log`。
- 微信/抖音十八个原生入口通过，真实执行官方导出；验证标识呈现、跳过手势消费、初始游戏状态不被误触。五款 Cocos 的双端检查额外断言 pre-engine 模块实际执行且不再请求旧 `logo.png` / `slogan.png`。见 `artifacts/entrance/native-verification.json`、`artifacts/brand-native-segment-1.log`。
- 原生首屏模块的执行和 WebGL 读回属于程序证据；场景内统一入场截图用于视觉检查。单步宿主在引擎接管时会重置画布，因此不把接管瞬间的空白截图当作首屏视觉通过依据。
- 自动化点击先等待入场层结束，再操作游戏。山海通用导航回归使用官方 `game.pause()` / `game.step()` 呈现输入结果，防止软件 GPU 截图耗时让角色自动跑到死亡；完整跑酷、碰撞与通关仍由专用合法操作流程验证。

根发布检查的全部子项目已分段完成。最初的 `pnpm check` 完成 Web 构建、155 项测试和站点检查后，在原生构建阶段被终止并返回 143；随后原生构建与全部余下检查分别成功退出，不把这次中断记录为整条命令通过。

| 检查 | 结果与本地证据 |
| --- | --- |
| 类型、规则和集成 | 155 项测试通过；`artifacts/brand-check.log`，最终平台类型检查见 `brand-platform-final-types.log` |
| 原生导出 | 十八个工程的导出、来源与包体预算通过；`artifacts/brand-native-build-resume.log` |
| 原生流程 | 九款启动、交互、生命周期和完整玩法；五款成长的十组触控、签到、购买、升级与重启通过；`artifacts/brand-native-segments.json` |
| Web 品牌与全站入口 | 九入口及加载/输入合约通过；大厅与九款游戏的手机/桌面入口、刷新、返回通过；`artifacts/entrance/web-verification.json`、`artifacts/web/report.json` |
| Web 专项 | 花园四视口、Cocos 完整流程、无尽长夜六场景与五款成长的二十组流程通过；`artifacts/brand-web-segments.json` |
| 山海、雪原完整 Web 流程 | 各四视口通过；`artifacts/brand-shanhai-web-flows.log`、`artifacts/brand-frost-web-flows.log` |
| 山海双原生完整流程 | 八试炼、四区域、7 公里以上无尽、免费试穿和成长通过；`artifacts/brand-shanhai-native-flows.log` |

两个分段清单逐项保存命令、退出码、时间与日志路径；它们和上述单独执行的项目共同覆盖根检查的全部阶段。发布前另以最终 Git 提交重建完整站点并验证 `release.json`，由根脚本统一发布。微信/抖音官方开发者工具、真机测试和平台上架尚未执行。
