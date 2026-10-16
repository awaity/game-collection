# 验证记录

参考采集：2026-10-16；完整实现验收：2026-10-17。极简版本 `9d88ade` 用于验证提灯、移动和战斗闭环，完整需求在后续独立提交中实现。

## 规则与持久化

- 12 项测试，包含六场景 × 六个 600 帧检查点，共 36 个原版完整状态哈希，覆盖四角色、血月和守夜人试炼。
- 原版 Rapier 0.21.0 实际参与碰撞与物理求解，敌人 AI 注册、武器/进化、遗物、选卡、消耗品和完整战斗规则保留。
- 会话测试覆盖畸形存档、购买、暂停、一次扣减/一次结算、五烽火解锁和功绩。
- 原作期望值独立保留，见 [规则说明](RULES.md) 和 [参考记录](REFERENCE.md)。

## 三端检查

官方 Creator 3.8.8 导出 Web、微信和抖音原生工程。公共资源、六场景、音频及 Rapier WASM 分包；每包低于 4 MiB，总包低于 20 MiB。WASM 在原生端从静态代码分包通过 WXWebAssembly/TTWebAssembly 加载。

完整流程覆盖首次设置、所有菜单、故事/角色/关卡/启程、真实键盘或触控移动、技能、暂停与装备、实际击杀、升级、结算一次、设置和保存/生命周期。Web 使用 390×844、1440×900、844×390、320×568；原生两平台使用 390×844，实际执行包内 game.js 和 WebGL。

内容回归额外使用合法解锁存档检查六个场景，角色依次为 Wren、Mira、Oskar、Sable、Wren、Mira。覆盖各场景初始升级（试炼含 24 个基础等级和 2 个炉火等级）、待初始冷却结束后真正释放技能、消耗品扣减一次、场景分包和本地音频请求。

```sh
pnpm --filter endless-night test
pnpm --filter endless-night build
pnpm --filter endless-night build:mini
node scripts/verify-cocos-game.mjs endless-night all
node scripts/verify-endless-content.mjs all
```

报告为 `artifacts/cocos/endless-night/{web,native}-verification.json` 和 `content/{web,native}.json`；官方构建来源及文件清单为 `dist/<target>/creator-build.json`。根目录 `pnpm check` 全部通过才发布。

## 视觉与音频

六场景使用相同角色、seed 7、标题仿真帧数和 390×844 视口对照。原作采集为纯场景，Creator 采集包含菜单遮罩，整体明暗不能直接比较。修复灰烬森林遗漏的自发光贴图，保留原版地面调色与余烬强度变化；证据位于 `artifacts/cocos/endless-night/comparison/`。

四角色、怪物关节、环境火焰、水车、风中植被、萤火/雪/余烬、烽火和战斗特效由 Creator 实际渲染。原版合成音效/配乐烘焙为 109 个本地 MP3，战斗音乐按强度切换；原版随机旋律变为循环片段。阴影、泛光、字体及后处理存在实现差异，不宣称逐像素相同。

原生宿主使用真实 WebGL 和包内 WASM，音频 API 仅记录调用及文件路径。真实 AppID、官方开发者工具、真机性能/声音、上传审核尚未执行；这些阶段不能由模拟测试替代。所有验证服务由脚本 finally 关闭。
