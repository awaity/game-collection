# 参考与移植来源

- 参考站点：https://surge-squad.vercel.app/，版本 1.2.0，采集于 2026-10-16。
- 经临时 GitHub Actions 获取公开站点模块、原始 GLB 模型和 raider 图集，并在本地镜像运行；本机原始证据在 `artifacts/public-references/surge-squad/`。
- `core.ts` 是配置、关卡、位姿、碰撞和完整仿真的 TypeScript 移植；规则不导入 Cocos、DOM、wx 或 tt。
- `meshes.bin` 保存来源人物与程序化场景网格，`world-atlas.png` 和 `road.png` 保留来源纹理。拾取、激光、投影、动画和反馈由 Cocos 材质与场景组件实现，运行时不携带 Three.js。
- 音效与背景音乐由原作 Sound 合成器离线生成 WAV；小游戏运行时使用 Creator AudioSource。
- `tests/reference-golden.json` 记录三章各七个完整仿真状态哈希，检查点为 0/6/15/30/60/100/160 秒；与来源相同输入逐步对照。
- 画面对照：相同 390×844 视口、章节 0、ready/6/15/35/55 秒。截图位于 `artifacts/surge-{source,cocos}-*.png`。

原作的浏览器渲染器替换为真实 Creator 场景。材质和阴影、字体抗锯齿仍有细微差别，不宣称逐像素一致。原始极简闭环保存在独立 Git 提交 `012151c`。
