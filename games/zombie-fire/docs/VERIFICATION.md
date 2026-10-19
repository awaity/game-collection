# 独立工程阶段验证

2026-10-20（北京时间）。运行规则及流程测试对应提交 `7f65e64`；后续掉落、物品和战场效果读取器对应 `645a007`、`e4c5f78`，不改变本轮导出中的战斗代码。此次区分元素与弹道抗性、麻痹与眩晕，并修正五类敌人的抗性、免疫和控制时长。完整复刻仍未完成；具体解释见 [敌人抗性](ENEMY-TRAITS.md)，差异见 [REFERENCE.md](REFERENCE.md)，逐项证据见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 84项通过，覆盖真实伤害、控制到期、传火免疫、击退/牵引及空中与地面攻击区别 | artifacts/zombie-fire-enemy-traits-rules.log |
| 主线合法成长 | 从空存档正常签到、选卡与购买，36关、六地图全部首尝试通关 | games/zombie-fire/artifacts/campaign-audit.json |
| Web实际运行 | 390×844、1440×900、844×390、320×568，四组各31项流程 | artifacts/zombie-fire-enemy-traits-web-{390,1440,844,320}.log |
| 微信、抖音导出运行 | 无DOM宿主各完成31项流程，实际WebGL与音频调用检查通过 | artifacts/zombie-fire-enemy-traits-{weixin,douyin}-390.log |
| 官方导出与包体 | Creator 3.8.8三目标导出，双原生来源和预算通过；微信主包2,545,614字节，抖音主包2,544,875字节 | artifacts/zombie-fire-enemy-traits-{web-build,mini-build,mini-verify}.log |
| 怪物属性引用 | 19表阶段关联全部10,867个非零怪物属性槽；三种无效输入均拒绝 | artifacts/zombie-fire-enemy-traits-reader.json |
| 掉落/物品与战场引用 | 22表阶段核对掉落、物品、货币；25表阶段核对子关卡说明、重复效果行和108项效果/状态引用；各四种无效输入均拒绝 | artifacts/zombie-fire-{campaign-loot,battlefield}-reader.json |

上一轮30项流程全部保留，包括真实首关胜利、暂停/选卡冻结、手动集火、正常无尽失败、奖励幂等、成长购买、四时装触发、六类进阶技能、幸运值预览与21点进化、三品质幸运球及衍生效果、弹球边界反射，以及正常购买研究6/10级、选取强化升维/弹球浪潮和观察真实攻击。

新增流程持续读取实际导出中的状态，检查麻痹和眩晕分离、免疫不被绕过、持盾者不再附加缺少参考支持的吸收盾，并检查敌人图鉴中的新说明。六组均实际观察到13类敌人、冻结、麻痹及持盾者；五类敌人的具体倍率、免疫与时长另由独立规则测试覆盖，不声称每个宿主都在抽样对局中遇到全部五类。当前武器没有主动施加真正眩晕的路径，该状态由规则测试独立验证。

研究、奖励和选卡验证使用合法输入，通过正常对局支付研究费用、获得技能并凑到21点；未授予生命、货币或技能，未改写随机状态或直接胜利。三十六关检查只证明当前本地配置存在合法成长路径，不等同于原版完整主线通关。

六组报告、状态JSON及截图均晚于对应官方导出及成功用例开始时间。命令与退出码保存在 artifacts/zombie-fire-enemy-traits-{web,native}-commands.json；实际截图复核与指纹保存在 artifacts/zombie-fire-enemy-traits-visual-review.json。上一轮记录及截图保存在 artifacts/zombie-fire-enemy-traits-baseline 与Git历史。

首次Web浏览器在进入游戏前因加载路径缺少libnspr4.so而退出。原失败命令和日志保存在 artifacts/zombie-fire-enemy-traits-startup-failure.json；随后给验证进程配置已有浏览器依赖目录的LD_LIBRARY_PATH，成功运行上述六组用例。该启动失败没有被记为一次游戏流程通过。

元素倍率、弹道分类与状态合并中仍有本地解释；冰雪僵尸的火伤说明+50%与原始属性+100%冲突明确保留，目前按说明采用1.5倍。25表读取器检查全部12,987份波次文件，但出怪条件、完整数值、子关卡锁定、地形/道具派发与服务器覆盖尚未还原；静态证据详见 [关卡配置](CAMPAIGN-CONFIG.md)、[掉落配置](LOOT-CONFIG.md)和[战场效果](BATTLEFIELD-CONFIG.md)。

原生运行真实官方game.js、适配器及WebGL，音频API为模拟宿主桩；软件GPU结果不能作为手机性能结论。官方微信/抖音开发者工具、手机真机、平台上传与审核未执行。Chrome不可取消touchcancel诊断单独记录，其余控制台错误或未捕获异常会使验证失败。

原版实际客户端、完整关卡/成长、视觉一致性与联机/赛季服务仍有缺口，新游戏尚未接入大厅或发布gh-pages。本轮浏览器、HTTP服务、原生宿主和Creator构建进程均已关闭，端口恢复到验证前基线，原有开发与编辑器服务保留；关闭检查记录为 artifacts/zombie-fire-enemy-traits-services-closed.json。
