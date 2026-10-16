# 飞机大战

- 遵守根目录 AGENTS.md；用户要求所有游戏提供 Web / 微信小游戏 / 抖音小游戏三个目标。
- `src/core/` 不引用 DOM、Canvas、平台 API；保持固定 60 Hz 与可重现随机数。
- `src/render/` 与 `src/app.ts` 经共享 Platform 注入，菜单及战斗三端共用。
- `upstream/` 是来源快照，保留原样，不参加生产构建。规则差异记录在 PROVENANCE.md。
- 保持上游的深蓝、青色、品红霓虹空战风格；Web 控件须保留语义按钮和键盘操作。
- 仅根目录负责 gh-pages 发布；验证结束关闭本轮所有本地服务。
