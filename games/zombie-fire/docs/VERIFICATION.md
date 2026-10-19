# 独立工程阶段验证

2026-10-19。此记录验证当前本地重建版本的可运行性，不代表原版内容和视觉已经完整复刻。完整目标仍在进行中，差异见 [REFERENCE.md](REFERENCE.md)。机器可读的结果、官方导出来源指纹和时间见 [VERIFICATION.json](VERIFICATION.json)。

| 检查 | 已执行结果 | 本地证据 |
| --- | --- | --- |
| 类型、规则与存档 | 47 项测试通过；确定性、暂停、合法前置/技能槽、弹道/状态、反弹、裂隙、纠缠、矩阵融合与禁锢、龙体能量和坠击、时装、存储回滚与奖励幂等 | `artifacts/zombie-fire-expanded-rules.log`、`zombie-fire-expanded-types.log` |
| 本地主线成长 | 从空存档正常签到、购买、选卡并通过 36 关，覆盖六地图；没有修改生命、敌人、货币或胜负 | `games/zombie-fire/artifacts/campaign-audit.json` |
| Web 实际运行 | 390×844、1440×900、844×390、320×568 四视口通过；控件没有越界或互相重叠 | `artifacts/cocos/zombie-fire/web-verification.json` |
| 微信实际导出运行 | 官方 wechatgame 导出在无 DOM 的原生宿主运行；触摸与取消、安全区瞄准、生命周期、战斗、成长、保存和重启通过 | `artifacts/cocos/zombie-fire/weixin-390-verification.json` |
| 抖音实际导出运行 | 官方 bytedance-mini-game 导出在无 DOM 的原生宿主运行；同一完整流程通过 | `artifacts/cocos/zombie-fire/douyin-390-verification.json` |
| 原生音频 | 两端在战斗中实际调用音频播放；单独在重启前记录，避免重启后计数归零造成歧义 | `artifacts/cocos/zombie-fire/weixin-audio.json`、`douyin-audio.json` |
| 导出来源与预算 | 三目标由官方 Cocos Creator 3.8.8 导出；双原生文件清单和主包预算校验通过，主包均约 2.4 MiB | `artifacts/zombie-fire-expanded-web-build.log`、`zombie-fire-expanded-mini-build.log`、`zombie-fire-expanded-mini-verify.log` |

端到端验证从空存档出发，执行三选一、刷新、暂停、真实点击集火、完整通关、下一关、签到、免费补给、枪械/防线/装备强化、研究、无尽及正常失败、佣兵招募升级、五套时装、宝石镶嵌、任务领取、分类图鉴、音效/音量/动态/画质设置及持久化重启。购买使用战斗和任务实际获得的货币。合法规则步进只提高验证执行速度，不给予无敌或直接胜利。

四种时装能力保留完整战斗验收：购买并装备对应衣装，从实际出现的三选一卡牌取得武器，继续正常战斗直到触发温压齐射、冰风暴、三连气刃或等离子场。Web 四视口和两个原生宿主都通过；`*-passive-{ember,arctic,hazard,arc}.png` 保留实际截图，图鉴同时显示触发说明。规则测试覆盖同目标电磁命中去重、10%/5% 两段伤害、80% 三连气刃、佣兵/追加攻击不递归充能、暂停和每局重置。

四种新增技能也通过全部六组完整流程：正常进入无尽、使用可见的选卡及刷新取得目标技能，观察无人机实际撞墙反弹、菱形裂隙生成、矩阵合并并对敌人积累束缚，以及满能量冰龙在预警后施放坠击。没有通过存档夹具授予技能、生命或货币。`*-advanced-{drone,rift,matrix,dragon}.png` 为实际导出截图；日志为 `artifacts/zombie-fire-expanded-web-all.log` 与 `artifacts/zombie-fire-expanded-native.log`。

新增十项规则测试检查：重复命中间隔与反弹增幅上限、枪械真实转向、菱形区域与 0.4 秒间隔 / 2.5 秒结束、负面状态延长与区域内烧灼加速、最多三名普通敌人的传送、纠缠的生命伤害账本 / 去重 / 10 秒到期、矩阵融合与离区解缚、中心牵引、冰龙索敌 / 满能量 / 两段伤害，以及龙心 / 能量上限 / 冷却。首轮测试定位并修复了裂隙第二次伤害提前一帧的问题。36 个本地关卡再次从空存档合法推进并全部通关，见 `artifacts/zombie-fire-expanded-campaign.log`。

本轮还查看了漫画敌人、档案纸卡片、四技能实体与特效、横屏耐久文字间距及冰龙能量显示。`original-enemy-gallery.png` 是通过实际导出模块绘制的十七种原创造型静态预览，**只用于美术检查，不是战斗或通关证据**。最后的冰系音效归类、矩阵持续音效调整及横屏间距修正已重新导出；JSON 逐项核对六组流程的时间晚于相应最终构建，并记录源指纹。

先前截图复核修复的 Creator Map 迭代器展开问题继续保留回归：电磁计数先经 `Array.from`，流程逐步断言充能为有限数字且低于阈值。官方 CLI 的成功退出码 36、最终指纹与验收时间均在 JSON 中。

原生宿主验证执行实际官方导出的脚本及 WebGL 1 渲染，断言没有 `window`/`document`，画面有有效像素且没有 GL 错误。它不等于微信/抖音官方开发者工具、手机真机测试或平台上架，这些尚未执行。

已人工查看营地、战斗、选卡、无尽、胜负、五套时装、成长、图鉴、小屏/横屏/桌面及新增能力截图。原版参考目前包括官网宣传资料与公开安装包的部分静态配置，未取得可交互原版的同状态实测，因此不宣称像素级或全量等价。新游戏尚未加入大厅、执行整站发布验收或发布到 gh-pages。本轮验证服务已关闭。
