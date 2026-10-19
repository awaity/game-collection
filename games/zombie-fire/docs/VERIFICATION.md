# 独立工程阶段验证

2026-10-20（北京时间）。本轮实现提交为 `3fdefdb`，接入双表支持的基础冷却、研究6级升维强化及空投物理元素，并统一新建/重启存档的零级研究结构；离线读取器另对应 `14eafbe`。完整复刻仍未完成；当前规则边界见 [冷却与研究应用](RESEARCH-COOLDOWN.md)，整体差异见 [REFERENCE.md](REFERENCE.md)，逐项证据见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 76项通过；实际施放周期、暂停、研究卡片/真实伤害、保存回滚和物理抗性 | artifacts/zombie-fire-research-cooldown-rules-final.log |
| 主线合法成长 | 空存档开始，正常签到、选卡、购买，通过36关及六地图 | games/zombie-fire/artifacts/campaign-audit.json、artifacts/zombie-fire-research-cooldown-campaign.log |
| Web实际运行 | 390×844、1440×900、844×390、320×568，四组各28项流程通过 | artifacts/zombie-fire-research-cooldown-web-{390,1440,844,320}.log |
| 微信、抖音导出运行 | 两个官方工程在无DOM宿主各完成28项流程、实际WebGL及音频调用检查 | artifacts/zombie-fire-research-cooldown-{weixin,douyin}-390.log |
| 官方导出与包体 | Creator 3.8.8三目标导出，双原生来源与预算通过 | artifacts/zombie-fire-research-cooldown-{web-build,mini-build,mini-verify}.log |
| 静态引用 | 十六表、828条完整技能等级记录、13,013条完整关卡基础记录和50组章节引用、17项基础冷却对照、18条升维分组和九条替换行 | artifacts/zombie-fire-level-base-reference.log |

原有27项流程全部保留：真实首关胜利、暂停/选卡冻结、手动集火、正常无尽失败、奖励幂等、成长购买、四时装触发、六类进阶技能、幸运值预览和21点进化、撞墙不耗敌人转向预算、三品质幸运球、衍生光球命中、高品质爆炸、准备阶段暂停、图鉴/设置及存档重启。

新增流程通过实际奖励支付六次弹球研究，正常抽取并选择“升维+”，确认伤害变为增加，并观察与新伤害数值一致的普通弹球真正命中敌人。研究面板、选卡和命中均保存截图，JSON记录研究等级、选择前后伤害、弹球ID、实际命中数与规则帧。没有授予生命、货币、技能或胜利，未改写随机状态。重启后另核对完整研究存档。

六组运行报告和新增截图均晚于各自官方导出，关联同一实现版本与构建指纹。执行清单见 artifacts/zombie-fire-research-cooldown-{web,native}-commands.json。另已人工查看六组视口/宿主的研究说明、选卡及战斗截图；逐图文件指纹与观察结果见 artifacts/zombie-fire-research-cooldown-visual-review.json。上一轮证据保留在 artifacts/zombie-fire-research-cooldown-baseline 和 Git 历史。

规则测试初次有一项使用旧4.8秒冷却的等待上限而失败；更新为8秒对应的第1921帧第五次施放、第2401帧触发幸运球，并增加提前一帧不得触发的检查后，76项全通过。原始失败日志保留于 artifacts/zombie-fire-research-cooldown-rules.log。

第一次Web390完整流程的最终重启检查发现新存档省略零级研究项、读档补齐该项，导致严格比较失败。现已从新存档起完整初始化十九个研究项，并保留深度相等检查；修复后重新导出三端，六组完整流程通过。首轮原生进程另以143退出，原因未知，确认其进程与端口已关闭后才重跑。失败截图、JSON、日志及中断记录保留于 artifacts/zombie-fire-research-cooldown-first-attempt。后续批量Web运行在横屏用例期间另以143退出，已保留此前成功的390/1440用例，将剩余视口拆成单独进程执行；部分截图及退出记录保留于 artifacts/zombie-fire-research-cooldown-web-844-interruption。

关卡表此次只完成严格文件指纹、全量字符串/ID边界及八条样本核对；未解码的末尾5字节所在载荷整条排除，章节表50组引用均关联到完整关卡记录，文字及场景配对一致；模式、波次和选卡库派发仍待查，没有将这些表的行数当作主线关数或直接导入游戏。

原生实际运行官方game.js、适配器和WebGL；音频API为模拟宿主桩，只证明调用链。软件GPU结果不作为手机性能证明。官方微信/抖音开发者工具、手机真机、平台上传和审核未执行；Chrome不可取消touchcancel诊断独立保留，其余控制台错误或未捕获异常会失败。

基础冷却不等于完整最终属性合并已还原。研究费用/上限、普通卡池、隐藏21点调度及部分研究文字冲突继续待查；原版完整主线/成长、视觉一致性、联机与线上赛季仍有缺口。新游戏尚未加入大厅或发布gh-pages，目标继续进行。

本轮浏览器、HTTP服务、原生模拟宿主和Creator构建进程已关闭，原有开发与编辑器服务保留；记录见 artifacts/zombie-fire-research-cooldown-services-closed.json。
