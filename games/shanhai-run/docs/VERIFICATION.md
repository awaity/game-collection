# 山海逃亡验收

日期：2026-10-19。工具链为 Node.js 22.23.2、pnpm 11.23.0、官方 Cocos Creator 3.8.8。参考采集与原创素材边界见 [REFERENCE.md](REFERENCE.md)。

## 验证方法

- `core.test.ts`：固定时钟、确定性、转弯窗口与错误转弯、跳跃/滑铲碰撞、追逐、道具、复活和实体回收。八试炼各三个种子正常操作通关；30 个种子各推进 42,000 帧无尽，距离超过 7 公里并覆盖四区域。
- `profile.test.ts`：签到与日期回拨、任务领取、首次/重复通关、对局累计差额、旧对局隔离、皮肤/法宝持久化与存储失败回滚。
- `session.test.ts`：交互教学在四个动作前真正停止等待；错误动作不能跳过。八试炼按顺序解锁与结算；暂停、每日固定种子、一次付费复活与重复死亡去重。
- `tests/flows.mjs`：真实运行官方导出，使用触摸或键盘完成教学；以公开玩家操作通关八试炼、无尽超过 7 公里。使用实际赚得的灵玉购买装扮、升级法宝、领取任务和成就，无货币/解锁夹具。验证四区域、商店分页、后台暂停、死亡/还魂、每日种子、设置和刷新/宿主重启。
- Web 视口为 390×844、320×568、1440×900、844×390。主操作检查可见边界和互不重叠；人工查看菜单、实战、四区域、装扮和成长截图。深色场景上的文本使用描边以保持可读。
- 原生宿主以真实 `game.js` 在启动时没有 `window` / `document` 的 Worker 中执行；运行官方小游戏适配器和真实 WebGL。音频 API 为宿主桩，只验证音频资源与调用链，不作为真机播放或听感证据。

规则与成长检查共 22 项。保留种子 `2090825472`，专门回归御风结束时紧邻断桥的安全落地；御风期间不叠加跳跃/滑铲，落地后可立即操作。验证脚本中的 `play` 只调用普通动作，不修改生命、障碍、胜负或货币。长跑按批推进真实规则，呈现时调用官方引擎绘制；这降低软件 GPU 的检查成本，不代表手机帧率。

## 资源与复现

合并网格和动态顶点缓冲用于人物、守山兽、场景、灵玉与特效。道路根据当前路段缓存并回收；换局与换画质销毁旧节点，场景节点数受限。音频为原创合成 WAV，由 `tools/make-audio.py` 生成。原生包沿用保守的 4 MiB 主包/分包、20 MiB 总包预算。

```bash
pnpm --filter shanhai-run test
pnpm --filter shanhai-run build
pnpm --filter shanhai-run build:mini
pnpm --filter shanhai-run verify:mini
node scripts/verify-cocos-game.mjs shanhai-run all
pnpm check
```

输出证据：`artifacts/shanhai-rules.log`、`artifacts/shanhai-collection-check.log`、`artifacts/shanhai-final-flows.log`、`artifacts/cocos/shanhai-run/all-verification.json` 以及同目录截图。官方导出日志位于游戏的 `artifacts/creator/`。这些本机证据不作为游戏素材发布。

换装与重开后，动态图形更新会显式同步 Creator 的绘制数量和包围盒；三端流程同时断言引擎实际绘制数量，避免旧顶点残留。浏览器主动取消触摸时，Creator 3.8 的 `preventDefault` 会触发 Chrome 的不可取消事件诊断，报告单独保留该条消息；取消手势仍接受状态检查，其他控制台错误与未捕获异常均导致失败。

封面来自真实运行画面，只隐藏 HUD 后拍摄，复现脚本 `scripts/capture-shanhai-cover.mjs`。大厅从 catalog 读取第九款入口，全站统一部署并通过 `release.json` 关联源码。

## 品牌与美术升级回归（2026-10-19）

精修行者的面部、发束、交领、护肩、玉佩、衣摆与靴子；五套衣装增加九尾、层叠羽翼、火羽、月轮等独立轮廓，并使用有界的动作粒子和加色光效。行装页支持购买前实时试穿，主菜单、战斗 HUD 和衣装页适配手机、桌面与横屏。

四个 Web 视口与微信/抖音两原生宿主的完整流程均通过。新增断言确认免费试穿只改变预览，不扣灵玉、不装备、不写存档；离开面板后恢复实际装备。原八试炼、四区域、7 公里以上无尽、合法赚币后的购买和法宝升级、后台暂停及重载继续通过。五套衣装的预览和实际装备均保留截图，动态网格绘制数量检查仍通过。

- `artifacts/brand-shanhai-web-flows.log`、`artifacts/cocos/shanhai-run/web-verification.json`：四视口完整流程。
- `artifacts/brand-shanhai-native-flows.log`、`artifacts/cocos/shanhai-run/native-verification.json`：双原生完整流程。
- `artifacts/cocos/shanhai-run/*-preview-*.png`、`*-outfit-*.png`：五衣装的免费预览与已装备状态；主菜单、四区域和动作截图同目录保存。
- `artifacts/brand-shanhai-preview.log`、`artifacts/brand-cover.log`：美术预览与实机封面采集。

角色、衣装和特效均为仓库内原创几何与着色器。保留原皮肤 ID、价格、存档结构和战斗规则；低画质减少装饰粒子，关闭画面动态时停用装饰运动。上述软件 GPU 验证不作为手机性能结论。

官方微信/抖音开发者工具、iOS/Android 真机、平台上传与审核未执行。公开网页版参考停在准备状态，没有把 HTML 或加载页面当作实际试玩证据。网页发布与小游戏平台上线分开记录。
