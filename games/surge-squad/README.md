# 电涌小队

保留参考版本 1.2.0 的三章，并扩展到六张地图，采用官方 Cocos Creator 3.8.8 + TypeScript。支持 Web、微信小游戏、抖音小游戏，无 WebView。使用根目录 pnpm 工作区与锁文件。

中央蓝带蓄能，横移消耗有限电能释放激光。击破数字门扩编；首位守关者倒下后才能领取金色电能 +99。队员、敌人、首领、子弹及等离子命中均来自独立仿真，画质不会改变伤害。六张地图的通关纪录、音量与画质保存在本机；自动演示不写入手动通关纪录。

手机拖动或点选底部跑道；电脑 A/D、方向键移动，空格/P 暂停，R 重开，M 声音，H 净画面。横屏和小屏保留完整菜单。

```sh
pnpm --filter surge-squad test
pnpm --filter surge-squad build
pnpm --filter surge-squad build:mini
node scripts/verify-cocos-game.mjs surge-squad all
```

构建说明见根目录 `docs/COCOS.md`；来源和验证状态见 `docs/REFERENCE.md`、`docs/VERIFICATION.md`。目录内不独立发布 gh-pages。

## 地图与成长扩展

新增冰川电网、沙丘风场、星港脉冲，各自改变敌群、充能带或金色电站时机。无尽每波击败双首领后接战，轮换地图、保留幸存队员并补员，敌人耐久逐步提高。

通过击破、通关、地图首胜、每日签到、四项每日任务和四项成就获得金币。无尽击破奖励翻倍，每波还有递增奖金。金币可购买五套配色与徽记，或升级火力、装填、生存三项能力，每项最高五级。强化在新对局生效，皮肤不增加战斗数值。

成长使用独立 `surge-squad.career.v1` 本地存档，原设置与关卡纪录继续保留。演示和回放不计金币。数值、平台边界和验证命令见 [扩展说明](../../docs/EXPANSION-2026-10.md)。
