# 无尽长夜

提一盏小灯，闯一场长夜。使用 **Cocos Creator 3.8.8 + TypeScript**，原版 **Rapier 0.21.0** 物理与完整战斗规则。四位提灯人、五座烽火、血月和守夜人试炼，共用 Web / 微信原生小游戏 / 抖音原生小游戏实现，无 WebView。

自动武器、魂石升级、卡牌重抽/放逐、武器进化、遗物、货郎消耗品、炉火永久升级、功绩和图鉴均读取实际游戏状态。所有敌人 AI、碰撞、伤害、胜负与奖励由统一仿真计算。

## 操作与存档

- 拖动屏幕移动；点击技能与行囊按钮，升级时选择卡牌。
- WASD / 方向键移动，空格 / E / 左 Shift 技能，1–7 使用物品，P / Esc 暂停。
- 选卡时 1–4 选择、R 重抽、B 切换放逐、S 跳过；宝箱可用回车 / 空格收下。
- 本机保存永久进度和设置；与参考版本一致，不保存正在进行的战局。进入后台暂停，返回后需主动继续。
- 设置提供独立主音量/音效/音乐、画质、伤害数字、震屏、减少闪烁、镜头距离及二次确认重置。

## 构建

```sh
pnpm --filter endless-night build
pnpm --filter endless-night build:mini
pnpm --filter endless-night test
node scripts/verify-cocos-game.mjs endless-night all
node scripts/verify-endless-content.mjs all
```

以上命令从仓库根目录执行。官方引擎安装、分包、原生 WASM 和 AppID 配置见根目录 `docs/COCOS.md`。输出为 `dist/web`、`dist/weixin`、`dist/douyin`；由根发布流程聚合到大厅。

[参考记录](docs/REFERENCE.md) · [规则验证](docs/RULES.md) · [三端验收](docs/VERIFICATION.md) · [素材与第三方来源](THIRD-PARTY.md)。构建/模拟宿主验证与官方开发者工具、真机和平台审核分别记录。
