# 雪原小营

Cocos Creator **3.8.8 + TypeScript**。采集木材和食材、消耗燃料烤制、供货收款，雇佣工人与柜台员工、连接传送带，将营地发展为雪原集镇。

包含完整参考 2.0.0 的有限资源、寻路与碰撞、自动生产、时代地标、灯网夜袭、五势力/商队/吞并、驯鹿/温室/钓鱼、声望补给/大招以及霸权、奇观、圣物、征服四种终局。规则与渲染分离，Web、微信原生小游戏、抖音原生小游戏共用同一套仿真；无 WebView。

## 操作与存档

- 触屏轻点地面自动寻路，拖动控制方向；点击任务指引前往当前目标。
- WASD / 方向键移动，P / Esc / 空格暂停，M 切换声音。
- 暂停菜单提供导航、升级、员工、时代、势力、补给、大招、待办、终局与设置；窄屏、横屏使用分页保留全部操作。
- 每四秒及进入菜单时保存本机经营状态，返回后台自动暂停。画质、相机、声音和重置操作均在设置中。

## 构建

从仓库根目录执行：

```sh
pnpm --filter frost-trail build
pnpm --filter frost-trail build:mini
pnpm --filter frost-trail test
node scripts/verify-cocos-game.mjs frost-trail all
```

需先安装官方 Creator，见根目录 `docs/COCOS.md`。输出为本目录 `dist/web`、`dist/weixin`、`dist/douyin`；仅仓库根目录发布整个游戏合集。

参考来源与原版快照见 [REFERENCE.md](docs/REFERENCE.md)，执行结果见 [VERIFICATION.md](docs/VERIFICATION.md)。官方小游戏开发者工具、真机与平台审核仍属于独立阶段。
