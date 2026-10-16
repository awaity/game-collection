# 验证记录

参考采集：2026-10-16；完整实现验收：2026-10-17。极简版本 `7391b91` 是中间里程碑，完整经营规则与视图在后续独立提交中实现。

## 规则与参考状态

- 14 项规则测试：24 个原版完整存档哈希、九个世界连续操作检查点、四种终局与暂停/存档边界。
- 世界操作覆盖实际移动、有限资源采集、木材燃料、烤制、供货收款、工人和传送带；终局保留原版计时及最后一夜事件。
- 期望值来自原版模块，未使用移植版重新生成，见 [参考记录](REFERENCE.md)。

## 三端检查

官方 Creator 3.8.8 导出 Web、微信和抖音工程；平台工程运行实际 `game.js`、引擎和本地资源。原生宿主启动时没有 window/document，使用真实 OffscreenCanvas/WebGL；音频检查覆盖本地文件和 API 调用。

完整流程包含采集、烤制、销售、收款、两类工人、两条传送带、柜台员工、自动化、全部管理面板、大招、暂停、设置和存档/生命周期。Web 视口为 390×844、1440×900、844×390、320×568，检查按钮边界及重叠。两种原生宿主使用 390×844。

```sh
pnpm --filter frost-trail test
pnpm --filter frost-trail build
pnpm --filter frost-trail build:mini
node scripts/verify-cocos-game.mjs frost-trail all
```

最终报告为 `artifacts/cocos/frost-trail/{web,native}-verification.json`；构建清单为 `dist/<target>/creator-build.json`。仅根目录 `pnpm check` 全部通过后发布。主包按 4 MiB 预算逐文件检查。

## 视觉对照

同一原版存档恢复到 Creator，比较 initial / wood / hunt / cooking / economy 五个状态；两侧使用 390×844、density 1，经营阶段现金均为 231。修复空实例产生的库存模型、旅客重置、吞并旗帜和任务路标；截图见 `artifacts/cocos/frost-trail/comparison/comparison-final.jpg`。

程序化模型、材质、纹理和声音来自原版，运行时由 Creator 渲染。剩余差异包括字体抗锯齿、UI 细节、镜头插值、光照和动画采样时刻，不宣称逐像素一致。

未配置真实 AppID，官方开发者工具、iOS/Android 真机、平台上传审核、实际音频输出与性能测量尚未执行。浏览器和模拟宿主结果不代替这些阶段；验证服务由脚本 finally 关闭。
