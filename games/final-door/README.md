# 最后一道门

Cocos Creator **3.8.8 + TypeScript** 三端工程，移植参考 v1.5.0 的完整权威仿真。Web、微信和抖音共享 `assets/scripts/core.ts`；原生包由官方 Creator 导出，不使用 WebView。

- 三条路线、种子挑战、自动演示与随时接管，60 Hz 固定步长。
- 每名队员、每颗弹丸、数字门、补给、装甲、障碍、敌人和首领都有真实状态；容量溢出明确拒绝。
- 首领预警、重击、胜负、战报、本机最佳与输入回放；回放可重现完整状态校验值。
- 拖动与键盘、暂停、后台暂停、声音、画质、减少动态效果、窄屏分页与原生安全区。
- Web 下载/导入 JSON，原生使用剪贴板；挑战链接和分享仅在玩家点击后触发。
- 原作动作图集、轮廓投影和程序化模型经过本地资源导入，由 Cocos MeshRenderer 绘制。

```sh
pnpm --filter final-door build
pnpm --filter final-door build:weixin
pnpm --filter final-door build:douyin
pnpm --filter final-door test
pnpm --filter final-door verify:mini
node scripts/verify-cocos.mjs
```

构建会准备官方类型声明，因此首次类型检查前先执行构建。工具链与 AppID 配置见 [COCOS.md](../../docs/COCOS.md)，来源见 [REFERENCE.md](docs/REFERENCE.md)，已执行与未执行的验证见 [VERIFICATION.md](docs/VERIFICATION.md)。

历史提交 `a6fede8` 保留可运行极简里程碑，完整版本在此基础上迭代。根目录负责大厅与全站部署，本目录不单独发布 gh-pages。
