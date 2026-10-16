# 飞机大战游戏 ✈️🚀

一款经典的飞机大战射击游戏,支持PC端、移动端和微信小程序。

## 🎮 游戏特色

### 双模式系统
- **闯关模式**: 击败每关的Boss才能通关,难度逐步提升
- **无限模式**: 坚持到最后,挑战最高分数

### 补给升级系统
- 🔫 **武器升级**: 从单发到五发散射,火力全开
- 🛡️ **护盾**: 抵挡一次致命伤害
- ❤️ **生命值**: 恢复生命,继续战斗

### 敌人系统
- **普通敌机**: 基础敌人,提供分数
- **精英敌机**: 更强的火力和血量
- **关卡Boss**: 强大的Boss,拥有圆形弹幕攻击

### 跨平台支持
- ✅ PC端 - 鼠标控制
- ✅ 移动端 - 触摸控制
- ✅ 微信小程序 - 完美兼容

## 🎯 操作说明

### PC端
- 鼠标移动控制飞机位置
- 自动射击

### 移动端
- 触摸屏幕移动飞机
- 自动射击

## 🚀 快速开始

### 本地运行

1. 克隆或下载项目
2. 使用任意HTTP服务器运行,例如:

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js http-server
npx http-server -p 8000

# 使用VS Code Live Server插件
# 右键index.html -> Open with Live Server
```

3. 在浏览器中打开 `http://localhost:8000`

### 微信小程序部署

1. 将项目文件复制到微信小程序项目中
2. 在小程序中使用 `<canvas>` 组件加载游戏
3. 配置小程序的 `app.json`:

```json
{
  "pages": [
    "pages/game/game"
  ],
  "window": {
    "navigationBarTitleText": "飞机大战",
    "navigationBarBackgroundColor": "#0a0e27"
  }
}
```

4. 创建游戏页面 `pages/game/game.wxml`:

```xml
<view class="game-container">
  <web-view src="{{gameUrl}}"></web-view>
</view>
```

或者使用原生Canvas:

```xml
<canvas 
  type="2d" 
  id="gameCanvas" 
  class="game-canvas"
  bindtouchstart="onTouchStart"
  bindtouchmove="onTouchMove"
></canvas>
```

## 📁 项目结构

```
my-game/
├── index.html          # 主HTML文件
├── styles.css          # 样式文件(赛博朋克风格)
├── game.js             # 游戏核心逻辑
└── README.md           # 项目说明
```

## 🎨 设计特色

- **赛博朋克风格**: 霓虹色彩、发光效果
- **流畅动画**: 粒子效果、爆炸特效
- **响应式设计**: 自适应各种屏幕尺寸
- **现代UI**: 渐变、阴影、微动画

## 🎯 游戏机制

### 武器等级系统
- **Lv.1**: 单发子弹
- **Lv.2**: 双发子弹
- **Lv.3**: 三发子弹
- **Lv.4**: 四发散射
- **Lv.5**: 五发强化散射(伤害提升)

### 分数系统
- 普通敌机: 10分
- 精英敌机: 50分
- Boss: 500分

### 难度提升
- 闯关模式: 每关Boss血量增加,敌人生成速度加快
- 无限模式: 持续提升难度,敌人生成间隔缩短

## 🛠️ 技术栈

- **HTML5 Canvas**: 游戏渲染
- **原生JavaScript**: 游戏逻辑(无框架依赖)
- **CSS3**: 现代UI设计
- **LocalStorage**: 最高分保存

## 📱 兼容性

- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ 移动端浏览器
- ✅ 微信内置浏览器
- ✅ 微信小程序

## 🎮 游戏截图

游戏包含以下界面:
- 开始菜单
- 游戏主界面
- 暂停菜单
- 关卡完成界面
- 游戏结束界面

## 📝 开发说明

### 自定义配置

在 `game.js` 中可以调整以下参数:

```javascript
// 敌人生成间隔
this.enemySpawnInterval = 1000; // 毫秒

// 补给生成间隔
this.powerUpSpawnInterval = 15000; // 毫秒

// 通关所需击杀数
this.enemiesNeededForBoss = 20;

// 玩家初始生命值
this.lives = 3;
```

### 添加新功能

游戏采用面向对象设计,主要类包括:
- `Game`: 游戏主控制器
- `Player`: 玩家飞机
- `Enemy`: 敌机
- `Boss`: Boss敌机
- `Bullet`: 子弹
- `PowerUp`: 补给道具
- `Particle`: 粒子效果

## 🤝 贡献

欢迎提交Issue和Pull Request!

## 📄 许可证

MIT License

## 🎉 致谢

感谢所有经典飞机大战游戏的启发!

---

**祝游戏愉快! 🎮✨**
