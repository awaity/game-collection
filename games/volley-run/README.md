# 弹幕小队 · VOLLEY RUN

游戏合集中的独立 Web / 微信小游戏 / 抖音小游戏，位于 `games/volley-run/`。

- 代码仓库：https://github.com/awaity/game-collection
- 在线游玩：https://awaity.github.io/game-collection/games/volley-run/

## 弹幕小队 · VOLLEY RUN

对 https://volley-run.vercel.app/ 的本地复刻。包含原版 3D 模型、六条路线、独立队员射击、数字门增援、武器舱、巨型守卫、音效、画质选项和确定性输入回放。运行时所有资源均从本地加载。

## 运行

需要 Node.js 22.14+、pnpm 11.23.0。以下命令在仓库根目录执行，依赖与锁文件由 pnpm 工作区统一管理。

```bash
pnpm install --frozen-lockfile
pnpm dev:volley-run
```

打开 http://localhost:4273/ 。也可在本游戏目录执行 `pnpm start`，使用原来的 4173 端口。

## 操作

- 鼠标或触屏左右拖动，或按 A / D、← / → 移动小队；队员自动射击。
- 射击数字门增加人数；击碎武器舱后经过它领取升级。
- 避开橙色警戒区域，击败最终守卫才能通关。
- 空格暂停 / 继续，R 重试，Esc 关闭弹窗或暂停。
- 集合点可以切换六条路线，新增「翡翠栈道」「极光长桥」「霓虹环线」，查看说明、选择画质、播放演示或导入回放。
- 在暂停或结算面板导出 JSON 输入回放，再通过「回放」导入。
- 音效与画质、个人通关记录保存在当前浏览器；演示不计入个人纪录。

## 验证与构建

```bash
pnpm --filter volley-run build
pnpm --filter volley-run test
pnpm --filter volley-run preview --host 0.0.0.0 --port 4175
```

静态网页输出到本游戏目录的 `dist/client`。`dist/server` 和 `dist/.openai` 是保留的 Sites 包装文件。测试依赖构建产物，先构建再测试。

浏览器需要支持 WebGL。手机默认使用「均衡」画质，也可选择「轻量」。`?qa=1` 开启与原版一致的确定性检查接口；正常网址不会开放模拟状态修改接口。

## 发布到 GitHub Pages

由仓库根目录统一构建并发布大厅和所有游戏，不单独覆盖 `gh-pages`。提交并上传源码后，在根目录执行：

```bash
pnpm run deploy
```

根目录命令先运行全站检查，再将 `dist/site` 发布到 `gh-pages`。本游戏的地址为 `/game-collection/games/volley-run/`，浏览器返回大厅入口由聚合构建添加。详见[仓库说明](../../README.md)。

页面、Three.js 和模型使用相对路径，支持游戏所在子目录部署。原生端复用原战斗逻辑与 Three 场景，通过平台文件系统加载相同五个 GLB。原生菜单合成为同一 WebGL 画布的覆盖层，默认轻量画质，提供六条路线、无尽、军需库、演示、暂停、重开与本地记录。文件回放的导入／导出 UI 和背景音乐仍为 Web 专属；原生提供本地音效。

执行 `pnpm --filter volley-run build:weixin` / `build:douyin` 输出 `dist/weixin` / `dist/douyin`。使用 `VOLLEY_RUN_WEIXIN_APP_ID` / `VOLLEY_RUN_DOUYIN_APP_ID` 注入独立 AppID，详见[平台说明](../../docs/PLATFORMS.md)。实际 WebGL 模拟宿主检查已接入根目录；官方开发者工具和真机验收待完成。

## 来源

游戏页面、逻辑及模型来自 [VOLLEY RUN 原站](https://volley-run.vercel.app/)，本仓库对运行资源进行了本地化。Three.js 使用 r140，许可见 [THREE-LICENSE.txt](public/vendor/THREE-LICENSE.txt)。

## 地图与成长扩展

新增三张地图改变补给布置、敌群与终局武器舱。无尽清关后轮换地图、保留幸存成员并补员，逐步提高敌人耐久。成长与接战人数使用第 3 版输入回放，旧第 1、2 版回放继续支持。

通过击破、通关、地图首胜、每日签到、四项每日任务和四项成就获得金币。无尽击破奖励翻倍，每波还有递增奖金。金币可购买五套配色与徽记，或升级火力、装填、生存三项能力，每项最高五级。强化在新对局生效，皮肤不增加战斗数值。

成长使用独立 `volley-run.career.v1` 本地存档，原设置与关卡纪录继续保留。演示和回放不计金币。数值、平台边界和验证命令见 [扩展说明](../../docs/EXPANSION-2026-10.md)。
