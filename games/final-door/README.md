# 最后一道门

Cocos Creator **3.8.8 + TypeScript** 三端工程，移植参考 v1.5.0 的完整权威仿真。Web、微信和抖音共享 `assets/scripts/core.ts`；原生包由官方 Creator 导出，不使用 WebView。

- 六条路线（新增冰川栈桥、暮砂遗迹、星港长廊）、种子挑战、自动演示与随时接管，60 Hz 固定步长。
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

## 地图与成长扩展

新增三张地图具有减速敌群、错位补给、遗迹障碍和额外装甲。无尽每波真实击败首领后接战，轮换路线、保留队员并提高压力。成长与接战人数写入 1.6.0 回放，旧 1.5.0 回放仍可使用。45 秒内未击败首领显示“尚未突破”，不发通关奖励。

通过击破、通关、地图首胜、每日签到、四项每日任务和四项成就获得金币。无尽击破奖励翻倍，每波还有递增奖金。金币可购买五套配色与徽记，或升级火力、装填、生存三项能力，每项最高五级。强化在新对局生效，皮肤不增加战斗数值。

成长使用独立 `final-door.career.v1` 本地存档，原设置与关卡纪录继续保留。演示和回放不计金币。数值、平台边界和验证命令见 [扩展说明](../../docs/EXPANSION-2026-10.md)。
