# 规则与存档验证

原始规则来自用户指定的 <https://endless-night.qilei991012.chatgpt.site>，2026-10-16 采集的 `index-CEtcJP9k.js`。保留原版 Rapier 0.21.0、全部敌人 AI 注册、固定 60Hz 战斗、四角色、六关卡、武器进化、选卡与永久进度；`domain.ts` 不依赖 DOM、wx 或 tt。

`tests/reference-golden.json` 来自未修改玩法的原始模块实际执行，共六场景、36 个完整状态哈希，覆盖四角色、血月和连战。相同的随机流、移动、技能、道具与选卡必须得到相同结果。数值取六位小数，忽略物理对象和函数引用；不得从移植版反向生成期望值。

`session.ts` 校验存档字段与范围，负责暂停、购买、每次道具消费、每局结算一次，以及通关/成就解锁。规则层和会话层测试合计十项，另有已保留的两项极简里程碑测试。`pnpm --filter endless-night test` 于 2026-10-16 全部通过。

原版仅保存永久进度和设置，不保存进行中的战局；移植版保留此行为。物理代码的许可见 `licenses/RAPIER-LICENSE.txt`，解压代码许可见 `licenses/FFLATE-LICENSE.txt`。
