# 独立工程阶段验证

2026-10-20（北京时间）。实现与离线读取器对应提交 `6e76464`。本轮修正弹球的两项裂变前置、八项重复选取上限及研究10级浪潮门槛，并调整小屏成长页文字与按钮间距。完整复刻仍未完成；静态证据、本地解释和未知条件见 [选卡条件](CARD-CONDITIONS.md)，整体差异见 [REFERENCE.md](REFERENCE.md)，逐项数据见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 79项通过，含条件边界、过期选项拒绝、实际额外弹道/轮数及保存重载 | artifacts/zombie-fire-card-conditions-rules.log |
| 主线合法成长 | 空存档正常签到、选卡、购买，36关及六地图均首尝试通关 | games/zombie-fire/artifacts/campaign-audit.json |
| Web实际运行 | 390×844、1440×900、844×390、320×568，四组各30项流程 | artifacts/zombie-fire-card-conditions-web-{390,1440,844,320}.log |
| 微信、抖音导出运行 | 两个官方工程在无DOM宿主各完成30项流程、实际WebGL及音频调用检查 | artifacts/zombie-fire-card-conditions-{weixin,douyin}-390.log |
| 官方导出与包体 | Creator 3.8.8三目标导出，双原生来源与预算通过 | artifacts/zombie-fire-card-conditions-{web-build,mini-build,mini-verify}.log |
| 静态引用 | 十六表、231条完整库/组引用、13,006项关卡/库候选匹配、九组弹球条件对比 | artifacts/zombie-fire-card-conditions-reference.log |

此前28项流程全部保留，包括真实首关胜利、暂停/选卡冻结、手动集火、正常无尽失败、奖励幂等、成长购买、四时装触发、六类进阶技能、幸运值预览和21点进化、撞墙次数保持、三品质幸运球和衍生效果，以及正常购买研究6级、选取升维+与真实弹道命中。

新增流程通过实际对局奖励支付研究7–10级，在正常升级选项中达到幸运21点并选择弹球浪潮，核对数量+1、轮数+1、敌人转向+2，并观察多枚普通球及真实重复命中。每次读取实际选项时检查重复次数、裂变前置与研究门槛；重启后完整研究结构及10级研究继续保留。未授予生命、货币或技能，未改写随机状态或直接胜利。

六组完整报告、浪潮选择/攻击/研究截图和JSON均晚于各自官方导出及成功用例开始时间。逐项命令见 artifacts/zombie-fire-card-conditions-{web,native}-commands.json。人工视觉复核见 artifacts/zombie-fire-card-conditions-visual-review.json。上一轮记录和运行截图保留于 artifacts/zombie-fire-card-conditions-baseline 与Git历史。

关卡尾块偏移28与库ID的匹配只是静态候选，不证明派发顺序或最终抽卡概率。首条不完整库记录的第一字段虽为31，完整组引用仍排除。普通组选卡零权重、研究2/14/31的说明冲突、21点隐藏授予和模式例外仍保留，未猜测实现。

原生运行真实官方game.js、适配器及WebGL，音频API为模拟宿主桩；软件GPU结果不能作为手机性能结论。官方微信/抖音开发者工具、手机真机、上传和审核未执行。Chrome不可取消touchcancel诊断单独记录，其余控制台错误或未捕获异常会失败。

微信导出日志完成后，Creator主进程已退出，WSL构建命令仍在等待；核对父进程、路径及启动时间后，仅清理本次构建留下的renderer与crashpad两个子进程。随后构建命令正常结束，导出完整性及包体验证通过；记录见 artifacts/zombie-fire-card-conditions-creator-orphans.json。没有停止其他服务或修改引擎。

原版完整数值、关卡/成长、视觉一致性及联机/赛季服务仍有缺口。新游戏尚未接入大厅或发布gh-pages。本轮浏览器、HTTP服务、原生宿主和Creator构建进程已关闭，原有开发及编辑器服务保留。
