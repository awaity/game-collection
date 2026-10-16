# 游戏合集

浏览器小游戏合集，当前收录「弹幕小队 · VOLLEY RUN」。

- 代码仓库：https://github.com/awaity/game-collection
- 在线游玩：https://awaity.github.io/game-collection/

## 弹幕小队 · VOLLEY RUN

对 https://volley-run.vercel.app/ 的本地复刻。包含原版 3D 模型、三条路线、独立队员射击、数字门增援、武器舱、巨型守卫、音效、画质选项和确定性输入回放。运行时所有资源均从本地加载。

## 运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm ci
npm start
```

打开 http://localhost:4173/ 。也可运行 `npm run dev -- --host 0.0.0.0 --port 4173`。

## 操作

- 鼠标或触屏左右拖动，或按 A / D、← / → 移动小队；队员自动射击。
- 射击数字门增加人数；击碎武器舱后经过它领取升级。
- 避开橙色警戒区域，击败最终守卫才能通关。
- 空格暂停 / 继续，R 重试，Esc 关闭弹窗或暂停。
- 集合点可以切换「赤岩长桥」「烈日防线」「最后一击」，查看说明、选择画质、播放演示或导入回放。
- 在暂停或结算面板导出 JSON 输入回放，再通过「回放」导入。
- 音效与画质、个人通关记录保存在当前浏览器；演示不计入个人纪录。

## 验证与构建

```bash
npm run build
npm test
npm run preview -- --host 0.0.0.0 --port 4175
```

静态网页输出到 `dist/client`。`dist/server` 和 `dist/.openai` 是预留的 Sites 包装文件。

浏览器需要支持 WebGL。手机默认使用「均衡」画质，也可选择「轻量」。`?qa=1` 开启与原版一致的确定性检查接口；正常网址不会开放模拟状态修改接口。

## 发布到 GitHub Pages

完成 GitHub 身份认证并确认 `origin` 指向本仓库后，执行：

```bash
npm ci
npm run deploy
```

`predeploy` 会先构建并运行全部测试，通过后由 npm 包 `gh-pages` 将 `dist/client` 发布到 `gh-pages` 分支，并添加 `.nojekyll`。源码保存在 `main` 分支。

GitHub Pages 发布源为 `Deploy from a branch`，分支为 `gh-pages`，目录为 `/ (root)`。页面和模型使用相对路径，支持 `/game-collection/` 子路径部署。

## 来源

游戏页面、逻辑及模型来自 [VOLLEY RUN 原站](https://volley-run.vercel.app/)，本仓库对运行资源进行了本地化。Three.js 使用 r140，许可见 [THREE-LICENSE.txt](public/vendor/THREE-LICENSE.txt)。
