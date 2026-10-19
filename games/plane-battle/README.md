# 飞机大战

源自 [awaity/my-game-plane](https://github.com/awaity/my-game-plane)，当前统一为 TypeScript 仿真 + Canvas 2D 渲染、三端共享菜单。上游版本与修正范围见 [PROVENANCE.md](PROVENANCE.md)。

在线：https://awaity.github.io/game-collection/games/plane-battle/

## 玩法

拖动飞机或按 WASD / 方向键四向移动，自动开火。空格暂停／继续，R 重开。青色补给升级至五发散射、绿色护盾抵挡一次伤害、生命补给恢复一点生命。闯关模式击落足够敌机后挑战 Boss；无限模式没有 Boss，每 30 秒提高压力。提供简单、标准、困难三档难度，本地保存设置与纪录。

## 开发与构建

在仓库根目录使用 pnpm：

```bash
pnpm dev:plane-battle
pnpm --filter plane-battle test
pnpm --filter plane-battle build
pnpm --filter plane-battle build:weixin
pnpm --filter plane-battle build:douyin
```

输出分别位于本游戏的 `dist/web/`、`dist/weixin/`、`dist/douyin/`。原生 AppID 为 `PLANE_BATTLE_WEIXIN_APP_ID` / `PLANE_BATTLE_DOUYIN_APP_ID`。完整检查和全站发布由根目录 `pnpm check`、`pnpm run deploy` 负责。

## 结构

- `src/core/game.ts`：不依赖平台的固定 60 Hz 规则、种子随机数、碰撞、关卡与道具。
- `src/render/`：保留上游霓虹方向的 Canvas 绘制、HUD、菜单与结算。
- `src/app.ts`：平台注入、输入、暂停、存储、共享时钟、清理生命周期。
- `src/web.ts` / `src/mini.ts`：浏览器语义控件与独立原生入口。
- `upstream/`：来源快照，只供审阅，不参加构建。

Web 地址添加 `?qa=1` 才暴露 `window.__PLANE__` 检查接口。封面由 `scripts/capture-plane-cover.mjs` 使用生产 Canvas 的 Boss 战斗姿态生成。

规则、构建、宿主和浏览器验证范围见[统一验证记录](../../docs/MULTIPLATFORM-VERIFICATION.md)。官方开发者工具与真机验收仍待完成。

## 地图与成长扩展

新增晨曦云海、雷暴走廊、珊瑚海岸、赤曜熔谷四张地图，每张三个任务，共十二关，逐关解锁。地图影响气流、精英敌机、补给和首领节奏。无尽每 30 秒提高压力，每两级轮换空域。

通过击破、通关、地图首胜、每日签到、四项每日任务和四项成就获得金币。无尽击破奖励翻倍，每波还有递增奖金。金币可购买五套配色与徽记，或升级火力、装填、生存三项能力，每项最高五级。强化在新对局生效，皮肤不增加战斗数值。

成长使用独立 `plane-battle.career.v1` 本地存档，原设置与关卡纪录继续保留。演示和回放不计金币。数值、平台边界和验证命令见 [扩展说明](../../docs/EXPANSION-2026-10.md)。
