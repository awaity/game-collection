# 独立工程阶段验证

2026-10-20（北京时间）。战斗实现对应提交 `fc92d24`；完整流程采用 `199c2ff` 的合法选卡与成长策略。普通护甲僵尸新增六次格挡、物理减半、能量增伤，以及护甲格数、受损胸甲、格挡与破甲反馈；同时修复弹球、传火、矩阵、旋风和裂隙的绕过路径。完整复刻尚未完成，规则依据与本地解释见 [敌人抗性](ENEMY-TRAITS.md)，完整差异见 [REFERENCE.md](REFERENCE.md)。逐项机器证据见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 94项通过，新增10项护甲测试；覆盖第六次仍格挡、第七次生效、控制、穿透、传火、牵引、裂隙和幸运球衍生攻击 | artifacts/zombie-fire-armor-rules.log |
| 主线合法成长 | 空存档正常签到、选卡与购买；36个本地关卡、六地图全部首尝试通关 | games/zombie-fire/artifacts/campaign-audit.json |
| Web实际运行 | 390×844、1440×900、844×390、320×568，各32项完整流程 | artifacts/zombie-fire-armor-web-{390,1440,844,320}.log |
| 微信、抖音实际导出 | 无DOM模拟宿主各32项流程，WebGL与音频调用检查通过 | artifacts/zombie-fire-armor-{weixin,douyin}-390.log |
| 官方导出与包体 | Creator 3.8.8三目标导出；微信主包2,547,226字节，抖音主包2,546,487字节，来源与预算通过 | artifacts/zombie-fire-armor-{web-build,mini-build,mini-verify}.log |
| 静态参考 | 27张表、12,987份波次文件检查通过；110普通护甲为6次，3110精英为18次，物理/能量属性相互核对 | artifacts/zombie-fire-armor-reference.json |

原有31项流程全部保留，包括正常首关胜利、三选一与刷新、触控集火与取消、暂停、无尽失败、幂等奖励、购买/研究/佣兵/时装/宝石、六类进阶技能、21点进化、三品质幸运球及衍生效果、研究6/10级、每日挑战与存档恢复。

新增流程在正常无尽中观察六层生成、层数下降、破甲后同一目标掉血，并暂停检查剩余护甲和敌人状态不变。受保护目标的生命保持满值，负面状态保持为零。六组均保存护甲状态、变化记录和截图；精确的六次完整格挡、第七击、各类负面状态及衍生攻击另由隔离规则测试验证。没有注入敌人、技能、生命、货币、直接胜利或改写随机状态。

最终流程通过正常对局赚取资源，再用可见按钮将武器和防线升至5级、购买研究。21点时优先选不消耗幸运值的卡片；没有指定进化时仍按真实候选继续构筑。验收始终要求实际选中弹球浪潮，并观察其增加的数量、轮数、弹射和真实弹球攻击。

失败与中断均单独保留：微信首次触控验收恰逢正常升级选卡，脚本修正为先处理可见选卡再点击敌人；手机与横屏的旧策略在8次正常对局中未完成指定进化，保留失败后调整合法选卡与成长策略重跑；桌面一次进程以143退出，原因未确定，未记为成功；旧策略的微信长对局被主动结束后从头重跑。证据分别位于 artifacts/zombie-fire-armor-weixin-first-failure、web-first-failure、web-844-first-failure、web-1440-interrupted 和 weixin-old-strategy（后四项同样带 zombie-fire-armor- 前缀）。最终六组均以同一份199c2ff流程成功退出。

各份成功报告、状态与截图均晚于对应官方导出及成功用例开始时间。命令清单位于 artifacts/zombie-fire-armor-{web,web-1440,web-844,native,douyin}-commands.json；截图人工复核和文件指纹保存在 artifacts/zombie-fire-armor-visual-review.json。微信实战截图直接捕获金色破甲提示；其余已选截图用于核对护甲标记、受损表现、格挡和图鉴布局，不将未捕获的瞬间视作直接视觉证据。旧验证与图片已保存在 artifacts/zombie-fire-armor-baseline。

3110精英护甲的18次格挡尚未实现；无伤害状态是否消耗层数、衍生效果顺序和暴击随机时序仍属本地解释。完整原版关卡、敌人图鉴、成长和视觉一致性仍有缺口；36关合法通关只证明本地配置的成长路径。掉落、战场与地形引用另见 [关卡配置](CAMPAIGN-CONFIG.md)、[掉落配置](LOOT-CONFIG.md)、[战场效果](BATTLEFIELD-CONFIG.md)和[地形配置](TERRAIN-CONFIG.md)。

原生验证运行真实官方game.js、适配器和WebGL；音频API为宿主桩，软件GPU不代表手机性能。微信/抖音官方开发者工具、真机、平台上传与审核尚未执行。Chrome既有不可取消touchcancel诊断单独记录，其余控制台错误或未捕获异常会导致失败。

本游戏仍未接入大厅或发布gh-pages。所有本轮浏览器、HTTP服务、模拟宿主和Creator构建进程已关闭，原有开发和编辑器服务保留；关闭检查见 artifacts/zombie-fire-armor-services-closed.json。
