# 来源与第三方代码

游戏玩法、文本、程序模型、材质、关卡、动画和合成音频移植自用户指定的《无尽长夜》公开站点：<https://endless-night.qilei991012.chatgpt.site>，于 2026-10-16 采集。源站公开加载的应用模块为 `index-CEtcJP9k.js`。此说明用于保留来源，不主张该作品的原创权或改变原作者的许可。

- Rapier 2D 0.21.0：原站使用的物理引擎。保留其 JavaScript 绑定及 WASM，许可证为 Apache-2.0，见 `licenses/RAPIER-LICENSE.txt`。移植时将顶层异步初始化改为显式 `initRapier`，增加原生小游戏静态包路径和 UTF-8 解码适配；物理求解与碰撞规则保持不变。
- fflate 0.8.2：解压本地几何和 Web 物理资源，MIT，见 `licenses/FFLATE-LICENSE.txt`。
- Cocos Creator 3.8.8：由官方编辑器编译和导出，使用其渲染、UI、音频及小游戏适配器；引擎来源和版本见根目录 `toolchains/cocos.json`、`docs/COCOS.md`。

运行时不包含原站 Three.js/React 渲染器，也不嵌入原站网页。动画矩阵适配只操作 Creator 的 Vec3/Quat/Mat4；所有模型实际由 Creator MeshRenderer 渲染。
