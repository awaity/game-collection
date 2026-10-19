# 独立工程阶段验证

2026-10-20（北京时间）。最新实现提交为 `cc7f28e`。本轮修正普通弹球的反射预算与连续碰撞，仍不代表原版内容、规则、画面或线上服务已完整复刻。差异见 [REFERENCE.md](REFERENCE.md)，逐项时间、版本与导出指纹见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 72项通过，覆盖新增边界预算、圆形表面/反射路径、远距离转向及撞墙事件间隔 | artifacts/zombie-fire-orb-reflection-rules-final.log |
| 本地主线成长 | 空存档正常签到、购买和选卡，通过36关及六地图 | games/zombie-fire/artifacts/campaign-audit.json、artifacts/zombie-fire-orb-reflection-campaign.log |
| Web实际运行 | 390×844、1440×900、844×390、320×568四视口完整流程通过 | artifacts/zombie-fire-orb-reflection-web-{390,1440,844,320}.log |
| 微信、抖音实际导出运行 | 两个官方工程在无DOM宿主完成全部玩法、成长与重启流程 | artifacts/zombie-fire-orb-reflection-{weixin,douyin}-390.log |
| 原生图形与音频 | 实际WebGL绘制，无GL错误；重启前记录战斗音频调用 | artifacts/cocos/zombie-fire/{weixin,douyin}-audio.json及对应验收JSON |
| 导出来源与预算 | 官方Creator 3.8.8三目标导出，双原生清单与包体预算通过 | artifacts/zombie-fire-orb-reflection-{web-build,mini-build,mini-verify}.log |
| 参考行为字段 | 固定指纹校验2,804个行为名称、十六组设置，含三种普通弹道的交叉比较 | artifacts/zombie-fire-orb-reflection-reference-final.log |
| 参考表边界 | 十四张表；技能基础表完整读取2,153/2,154条，十八类主技能引用全部匹配，未解析的末尾11字节及其记录排除 | artifacts/zombie-fire-orb-reflection-skill-level-reference.log |
| 技能等级与研究引用 | 828条完整记录，十八类各1–46级；研究说明/卡牌引用、17项基础冷却显示对照通过，缺失显示文字407700146保留为未知 | artifacts/zombie-fire-orb-reflection-skill-level-reference.log |

## 本轮实现与边界

普通球与裂变球的边界反射不再扣除敌人弹射预算。普通球基础为3次转向，按初次命中后可再转向3次实现；弹球浪潮继续增加2次。转向可寻找全场最近存活目标，裂变球半径为基础球的0.7倍，速度为14/18；仍保持3.5秒寿命与非递归。普通球撞墙裂变/爆炸按每球0.5秒限制。

碰撞按每帧实际路径和接触时刻依次处理：在敌人的圆形表面命中，在墙上反射，沿新方向推进剩余时间。修复了反射端点之间的直线导致漏判/隔空命中，以及按敌人中心排序导致体型较大目标被错误穿过的问题。8秒/3.5秒寿命、0.5秒连发和按目标独立命中间隔、暂停/选卡冻结继续通过。

以上规则是具名字段与交叉配置支持的重建解释；反射枚举、首次命中计数、场景对象、事件61的count字段及原版目标排序仍待客户端验证。像素速度、伤害基数、连续碰撞算法和数值容差是本地选择，详见 [弹球配置核对](LUCKY-ORB-REFERENCE.md)。21点隐藏授予、钢珠机等分支、普通卡池和研究条件仍未完整还原。

参考读取器另以提交 `4839ebf` 核对技能基础表及等级表。基础表末条记录按已知长度推算到860,619字节文件末尾，其不完整内容没有参与字段解释。等级表828条记录完整对齐，17类一级“冷却”显示值与基础表偏移17相同，冰龙普攻2秒/技能6秒分别关联不同行为。原版属性派发、最低冷却和合并算法仍未验证，未据此更改游戏数值。弹球研究的解锁、初始幸运、额外弹射及概率保留次数等引用已纳入记录，同名卡的替换和模式条件继续待查。详见 [参考表结构](REFERENCE-TABLE-SCHEMA.md)。研究提交没有改变本轮导出的战斗实现。

## 实际导出验收

六组均重新执行原有完整流程：首次三选一与刷新、暂停、集火、通关及下一关、签到、补给、武器/防线/装备成长、研究、无尽及正常失败、佣兵、五套时装、宝石、任务、图鉴、设置和存档重启。四套时装触发、无人机反弹、裂隙、矩阵融合与禁锢、冰龙坠击、电极连线、多维弹球本地21点进化及溢出继续通过。

新增导出断言观察同一弹球在命中数不变时发生真实撞墙，确认剩余敌人转向次数不变，同时检查普通/裂变球寿命上限。每组证据位于artifacts/cocos/zombie-fire/*-orb-reflections.json，含弹球ID、来源、规则帧、前后撞墙数/命中数/剩余次数。通过可见卡片正常选取技能，没有授予生命、货币、解锁或胜利。

三品质幸运主球、衍生光球的实际命中、高品质范围爆炸和准备期间暂停均继续保留断言、记录和实际渲染截图。流程新增一项边界预算检查，原有验收要求保留；QA只推进真实规则时间。六组运行报告均晚于本轮官方导出，分别关联源码版本和构建指纹。

另已查看本次导出的四种Web尺寸及双原生截图，包括小屏/横屏选卡、弹球命中/爆炸和底部状态，未见所选画面的按钮或状态文字被裁切、重叠；所查看的八张截图列在JSON的visualEvidence.reviewedScreens。该检查不代表与原版客户端的视觉一致性已经完成。

原生在无window/document的Worker中执行真实game.js、官方适配器及WebGL。音频API为宿主桩，只证明资源与调用链；软件GPU检查不作为手机帧率证明。Chrome不可取消touchcancel诊断单独保留，其他控制台错误及未捕获异常会失败。执行清单含时间和退出码：artifacts/zombie-fire-orb-reflection-{web,native}-commands.json。上一轮证据保留在artifacts/zombie-fire-orb-reflection-baseline和Git历史。

## 尚未完成与服务关闭

原版可交互客户端、完整主线/成长/选卡规则、视觉一致性、线上赛季及联机仍有缺口。本地36关不等于原版409关及后续更新。微信/抖音官方开发者工具、手机真机、平台上传和审核未执行。新游戏未加入大厅或发布gh-pages，完整目标继续进行。

本轮浏览器、HTTP服务、原生模拟宿主及Creator构建进程已关闭，原有开发与编辑器服务保留；记录见artifacts/zombie-fire-orb-reflection-services-closed.json。
