# 独立工程阶段验证

2026-10-19。最新实现提交为 `ffebc58`。本轮修正普通弹球与裂变时序，当前仍是十九类武器的独立重建阶段，不代表原版内容、规则、画面或线上服务已完整复刻。差异见 [REFERENCE.md](REFERENCE.md)，逐项时间、版本与导出指纹见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 68项通过，包括新增寿命边界、按目标命中间隔和暂停/选卡冻结 | artifacts/zombie-fire-orb-timing-rules.log |
| 本地主线成长 | 空存档正常签到、购买和选卡，通过36关及六地图 | games/zombie-fire/artifacts/campaign-audit.json、artifacts/zombie-fire-orb-timing-campaign.log |
| Web实际运行 | 390×844、1440×900、844×390、320×568四视口完整流程通过 | artifacts/zombie-fire-orb-timing-web-{390,1440,844,320}.log |
| 微信、抖音实际导出运行 | 两个官方原生工程在无DOM宿主完成全部玩法、成长与重启流程 | artifacts/zombie-fire-orb-timing-{weixin,douyin}-390.log |
| 图形与音频 | 原生真实WebGL绘制，无GL错误；重启前记录战斗音频调用 | artifacts/cocos/zombie-fire/{weixin,douyin}-audio.json及对应验收JSON |
| 导出来源与预算 | 官方Creator 3.8.8三目标导出，双原生清单与包体预算通过，主包约2.42 MiB | artifacts/zombie-fire-orb-timing-{web-build,mini-build,mini-verify}.log |
| 参考字段 | 固定指纹校验2,804个行为名称、十三组选择性设置，保留自身Buff所需/禁止条件 | artifacts/zombie-fire-orb-timing-reference.log |

## 本轮修正与规则边界

普通球飞行从12秒改为8秒、裂变子球从6秒改为3.5秒；连发间隔从0.22秒改为0.5秒，同一弹球对同一目标的伤害间隔从0.2秒改为0.5秒。每个目标独立计时，暂停和选卡冻结全部计时。已有幸运弹球继续使用独立准备、飞行与衍生攻击参数。

新增规则测试检查第480/210帧到期和两个目标各自的30帧命中间隔，原连发测试改为检查第30帧才出现下一轮。暂停、选卡、真实伤害、护甲、裂变非递归、三品质幸运弹球、四项终极效果、对象上限及原子存档继续通过。隔离规则测试会构造碰撞场景，导出验收只允许真实输入、可见卡片选择和时间推进。

配置证据与离散化解释见 [弹球配置核对](LUCKY-ORB-REFERENCE.md)。两个普通球元素的自身Buff条件互斥，没有将其误当成双发。普通球与子球的墙壁/目标反弹预算、速度和伤害映射仍有差异，21点隐藏词条及钢珠机等分支仍未完成。

## 实际运行范围

六组均重新执行原有完整流程：首次三选一与刷新、暂停、集火、通关及下一关、签到、补给、武器/防线/装备成长、研究、无尽及正常失败、佣兵、五套时装、宝石、任务、图鉴、设置和持久化重启。四套时装的命中触发、无人机反弹、裂隙、矩阵融合与禁锢、冰龙坠击、电极连线、多维弹球21点本地进化及溢出继续通过。

三品质幸运主球、衍生光球的实际命中、高品质范围爆炸、准备期间暂停均有导出记录和截图；通过可见选项、正常刷新及有限重开获得技能，没有修改随机状态、生命、货币或胜负。六组原有流程断言和脚本哈希保持一致，未降低验收要求。QA只加速确定性规则时间，截图仍调用实际引擎绘制。

所有运行报告都晚于本轮对应导出，并关联同一实现版本。原生宿主在没有window/document的Worker中执行真实game.js、官方适配器及WebGL；音频API为宿主桩，只证明资源与调用链。Chrome不可取消touchcancel诊断单独保留，其他控制台错误或未捕获异常会使检查失败。上述软件GPU结果不作为手机性能证明。

浏览器首次启动因找不到libnspr4.so退出1，尚未进入游戏；保留失败日志后，以已有本机依赖目录重跑成功。各命令退出码、时间和日志见artifacts/zombie-fire-orb-timing-{web-rest,native}-commands.json。上一轮的不同版本/短流程证据保留在artifacts/zombie-fire-orb-timing-baseline及Git历史，不当成本轮通过证据。

## 未完成项与服务关闭

原版可交互客户端、完整主线/成长/选卡规则、视觉一致性、线上赛季及联机尚未验证。本地36关不等于原版409关及后续更新。官方微信/抖音开发者工具、手机真机和平台上架尚未执行；新游戏未加入大厅或发布gh-pages，整体目标继续进行。

本轮浏览器、HTTP服务、原生模拟宿主及Creator构建进程已关闭，原有开发与编辑器服务保留；记录见artifacts/zombie-fire-orb-timing-services-closed.json。
