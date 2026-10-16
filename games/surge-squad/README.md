# 电涌小队

基于参考版本 1.2.0 的完整三章玩法，采用官方 Cocos Creator 3.8.8 + TypeScript。支持 Web、微信小游戏、抖音小游戏，无 WebView。使用根目录 pnpm 工作区与锁文件。

中央蓝带蓄能，横移消耗有限电能释放激光。击破数字门扩编；首位守关者倒下后才能领取金色电能 +99。队员、敌人、首领、子弹及等离子命中均来自独立仿真，画质不会改变伤害。三章通关纪录、音量与画质保存在本机；自动演示不写入手动通关纪录。

手机拖动或点选底部跑道；电脑 A/D、方向键移动，空格/P 暂停，R 重开，M 声音，H 净画面。横屏和小屏保留完整菜单。

```sh
pnpm --filter surge-squad test
pnpm --filter surge-squad build
pnpm --filter surge-squad build:mini
node scripts/verify-cocos-game.mjs surge-squad all
```

构建说明见根目录 `docs/COCOS.md`；来源和验证状态见 `docs/REFERENCE.md`、`docs/VERIFICATION.md`。目录内不独立发布 gh-pages。
