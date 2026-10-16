# 三端适配

## 共享游戏

`core/` 不引用浏览器或平台对象。`render/` 在标准 Canvas 2D 上绘制游戏的全部界面；`app.ts` 通过 Host 接口处理输入、存储、音频和隐藏事件。浏览器额外给 Canvas 控件提供透明的语义按钮、键盘焦点和读屏状态提示；小游戏直接用同一组命中区域处理触控。

每次以 1/30 秒推进模拟，实际渲染由宿主 requestAnimationFrame 驱动。长时间切后台不会补算战斗；失去焦点时暂停，必须手动继续。像素比限制为 2。无尽模式限制同时存在的僵尸、子弹、阳光和特效数量。

## 浏览器

`pnpm dev` 在 4290 端口启动局域网可访问的开发服务器。`pnpm build` 构建到 `dist/web`，资源路径为相对路径，支持站点子目录。部署时上传整个 `dist/web`，通过 HTTP(S) 打开，不要直接双击 HTML。

使用现代浏览器的 Canvas 2D、Pointer Events、Web Audio、localStorage 和 requestAnimationFrame。所有画面在本地绘制，不请求外部字体、图像、音频或服务。禁用声音时不创建音频实例；浏览器阻止音频时可以正常继续游戏。存储失败会在游戏中提示进度未保存。

移动设备优先使用竖屏；横屏也有布局。窗口变化会重算 Canvas 尺寸及输入坐标。对较矮的窗口，菜单及弹窗按可用高度缩放。

## 微信小游戏

1. 执行 `GARDEN_GUARD_WEIXIN_APP_ID=你的AppID pnpm build:weixin`。
2. 在微信开发者工具中新建／导入**小游戏**项目，目录选择本项目的 `dist/weixin/`。
3. 确认 AppID 属于小游戏账号。使用微信小游戏基础库 3.8.0 或更新版本进行调试；工程配置可按账号当前可用版本调整。
4. 编译并预览到手机。

入口直接使用 `wx.createCanvas()`，不使用 WebView、WXML 或 DOM。触控接 `wx.onTouchStart` / `onTouchMove`；存档接 `wx.getStorageSync` / `setStorageSync`；声音接 `wx.createInnerAudioContext`；后台事件接 `wx.onHide`；窗口尺寸优先 `getWindowInfo`，回退 `getSystemInfoSync`。

## 抖音小游戏

1. 执行 `GARDEN_GUARD_DOUYIN_APP_ID=你的AppID pnpm build:douyin`。
2. 在抖音开发者工具中新建／导入**小游戏**项目，目录选择 `dist/douyin/`，填写账号下的小游戏 AppID。
3. 使用工具当前的小游戏基础库编译，并进行真机预览。

入口使用 `tt.createCanvas()`、`tt.onTouchStart`、`tt.getStorageSync`、`tt.setStorageSync`、`tt.createInnerAudioContext` 和 `tt.onHide`。两个小游戏包由构建常量选择各自 API，不会串用另一个平台的全局对象。未设置 AppID 时，抖音工程配置保留为空，便于在导入工具时填写。

两端均避开状态栏、胶囊按钮和底部安全区域；所有 WAV 随包分发，不需要资源域名和后端。游戏本身不接登录、分享、广告、支付、开放数据域或排行榜。

## 验证边界

`pnpm verify:mini` 对两个实际压缩后的 `game.js` 分别创建**没有 window 和 document** 的宿主环境：提供 Canvas/API 合约，执行原生触摸事件，检查首页、设置保存、进入战斗、种植、阳光生产与收集、暂停恢复、本地音效路径及安全区域。它验证原生入口和共享逻辑不依赖 DOM，并不是官方基础库模拟器。

浏览器的真实 Canvas 渲染、触控、键盘和完整模式流程由 `pnpm verify:web` 验证。当前环境没有官方微信／抖音开发者工具与对应 AppID，因此尚未声称通过官方工具或 iOS / Android 真机验收，也未上传、审核或发布。

拿到工具和账号后，真机需检查：首次进入与关卡解锁、阳光与植物触控、全屏安全区域、切后台恢复、静音、小游戏重启后的记录，以及较长无尽战斗的帧率。这些是平台上线验收；源码和可导入工程已完整提供。
