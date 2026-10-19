# 资源来源与复现

| 资源 | 作者/来源 | 可复现源 | 用途 |
| --- | --- | --- | --- |
| 六种战场设施、堡垒和元素效果 | 本仓库原创 | `assets/scripts/art.ts` | Cocos Graphics 实时绘制，世界坐标投影新技能范围 |
| 十七种敌人的曲线、衣装和装备轮廓 | 本仓库原创 | `assets/scripts/infected.ts` | 尸群、首领和控制姿态 |
| 营地堡垒、枪手、五套时装、旋翼无人机和机械冰龙 | 本仓库原创 | `assets/scripts/illustration.ts` | 营地、时装预览和战斗实体 |
| 十七种武器图标 | 本仓库原创 | `assets/scripts/icons.ts` | 技能卡、右侧技能栏；档案纸卡片另由 `hud.ts` 绘制 |
| 枪声、爆炸、冰、电、换弹、受击、升级、胜负提示及音乐 | 本仓库原创合成 | `tools/make-assets.py` | 16 kHz 单声道 PCM WAV，跨端 AudioSource |
| 开局游戏标识及入场 | 合集原创共享资源 | `shared/brand/mark.svg`、共享平台适配 | 沿用统一三端品牌入口 |
| 中文字体 | 系统字体回退 | Cocos Label 的 Noto Sans CJK SC 字体族 | 无外部字体文件或在线字体依赖 |
| 大厅封面 | 当前游戏实战截图 | 根目录 `scripts/capture-zombie-fire-cover.mjs` | 840×630 WebP，正常无尽第一波的枪手、尸群与跃迁电子；原图和状态保存在 `artifacts/zombie-fire-preview/` |

在游戏目录运行 `python3 tools/make-assets.py` 可复现 WAV 与缺失的稳定 `.meta`。已有入口脚本和场景 UUID 不会重写。

官网宣传图和攻略文字只用于参考研究，文件位于根目录忽略的 `artifacts/research/zombie-fire/`，不被 Creator 或静态站点收集。没有从原版提取的游戏代码、角色图集或音频。
