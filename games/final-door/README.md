# 最后一道门

本目录为 Cocos Creator 3.8.8 + TypeScript 工程。规则在 `assets/scripts/core.ts`，渲染组件在 `assets/scripts/FinalDoor.ts`，由真实 Creator 导出 Web、微信和抖音小游戏。

当前提交是**可运行的极简中间里程碑**：左右移动、每名队员自动射击、击中门增加门值、过门增员、首领真实耐久、胜负、暂停与重开。它不代表参考游戏已经完整复刻，未接入正式大厅。

后续迭代将补齐参考 v1.5.0 的三条路线、种子和回放、真实人群碰撞与补给、首领预警和进攻、战报及本地最佳，并使用采集的原始模型和动画图集对齐画面。

```sh
pnpm --filter final-door build
pnpm --filter final-door build:weixin
pnpm --filter final-door build:douyin
pnpm --filter final-door typecheck
pnpm --filter final-door test
```

工具链安装、缓存与验证边界见 [COCOS.md](../../docs/COCOS.md)。官方场景、脚本和资源 UUID 一并提交；不提交 `library`、`temp` 和 `dist`。
