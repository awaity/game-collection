// 游戏主类
class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameMode = null; // 'stage' 或 'endless'
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.stage = 1;
        this.killCount = 0;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.boss = null;
        
        // 游戏配置
        this.enemySpawnTimer = 0;
        this.enemySpawnInterval = 1000;
        this.powerUpSpawnTimer = 0;
        this.powerUpSpawnInterval = 15000;
        this.bossSpawned = false;
        this.enemiesKilledInStage = 0;
        this.enemiesNeededForBoss = 20;
        
        // 动画
        this.lastTime = 0;
        this.animationId = null;
        
        // 输入控制
        this.mouseX = 0;
        this.mouseY = 0;
        this.touchX = 0;
        this.touchY = 0;
        
        // 键盘控制
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.useKeyboard = false; // 标记是否使用键盘控制
        
        // 难度设置
        this.difficulty = 'normal';
        this.difficultySettings = {
            easy: { 
                lives: 5, 
                spawnInterval: 1500, 
                speedMult: 0.8, 
                healthMult: 0.8, 
                scoreMult: 0.5 
            },
            normal: { 
                lives: 3, 
                spawnInterval: 1000, 
                speedMult: 1.0, 
                healthMult: 1.0, 
                scoreMult: 1.0 
            },
            hard: { 
                lives: 2, 
                spawnInterval: 800, 
                speedMult: 1.2, 
                healthMult: 1.2, 
                scoreMult: 1.5 
            }
        };

        this.init();
    }
    
    init() {
        // 显示最高分
        document.getElementById('highScore').textContent = this.highScore;
        
        // 绑定事件
        this.bindEvents();
    }
    
    bindEvents() {
        // 鼠标事件
        // document.addEventListener('mousemove', (e) => {
        //     if (this.canvas) {
        //         const rect = this.canvas.getBoundingClientRect();
        //         this.mouseX = e.clientX - rect.left;
        //         this.mouseY = e.clientY - rect.top;
        //         this.useKeyboard = false; // 使用鼠标时禁用键盘模式
        //     }
        // });
        
        // 触摸事件
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.canvas && e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.touchX = e.touches[0].clientX - rect.left;
                this.touchY = e.touches[0].clientY - rect.top;
                this.useKeyboard = false; // 使用触摸时禁用键盘模式
            }
        }, { passive: false });
        
        document.addEventListener('touchstart', (e) => {
            if (this.canvas && e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.touchX = e.touches[0].clientX - rect.left;
                this.touchY = e.touches[0].clientY - rect.top;
                this.useKeyboard = false; // 使用触摸时禁用键盘模式
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning || this.isPaused) return;
            
            this.useKeyboard = true; // 使用键盘时启用键盘模式
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.keys.right = false;
                    break;
            }
        });
    }
    
    startGame(mode) {
        this.gameMode = mode;
        
        // 获取并应用难度设置
        const difficultySelect = document.getElementById('difficultySelect');
        this.difficulty = difficultySelect ? difficultySelect.value : 'normal';
        const settings = this.difficultySettings[this.difficulty];
        
        this.isRunning = true;
        this.isPaused = false;
        this.score = 0;
        this.stage = 1;
        this.killCount = 0;
        this.enemiesKilledInStage = 0;
        this.bossSpawned = false;
        
        // 应用难度设置
        this.enemySpawnInterval = settings.spawnInterval;
        
        // 隐藏菜单,显示游戏
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'flex';
        
        // 更新难度显示
        const difficultyNames = {
            easy: '简单',
            normal: '普通',
            hard: '困难'
        };
        const displayEl = document.getElementById('difficultyDisplay');
        if (displayEl) {
            displayEl.textContent = difficultyNames[this.difficulty];
        }
        
        // 初始化画布
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 初始化游戏对象
        this.initGameObjects();
        
        // 更新UI
        this.updateUI();
        
        // 开始游戏循环
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const info = document.getElementById('gameInfo');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight - info.clientHeight;
    }
    
    initGameObjects() {
        // 重置数组
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.particles = [];
        this.boss = null;
        
        // 创建玩家
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 100);
        
        // 应用玩家生命值设置
        const settings = this.difficultySettings[this.difficulty];
        if (settings) {
            this.player.lives = settings.lives;
            this.player.maxLives = settings.lives + 2;
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (!this.isPaused) {
            this.update(deltaTime);
            this.render();
        }
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // 更新玩家位置
        if (this.useKeyboard) {
            // 键盘控制模式
            this.player.moveWithKeys(this.keys, deltaTime);
        } else {
            // 鼠标/触摸控制模式
            const targetX = this.touchX || this.mouseX;
            const targetY = this.touchY || this.mouseY;
            
            if (targetX && targetY) {
                this.player.moveTo(targetX, targetY);
            }
        }
        
        // 更新玩家
        this.player.update(deltaTime);
        
        // 玩家射击
        if (this.player.canShoot(deltaTime)) {
            this.bullets.push(...this.player.shoot());
        }
        
        // 生成敌人
        if (!this.bossSpawned) {
            this.enemySpawnTimer += deltaTime;
            if (this.enemySpawnTimer >= this.enemySpawnInterval) {
                this.spawnEnemy();
                this.enemySpawnTimer = 0;
            }
        }
        
        // 生成补给
        this.powerUpSpawnTimer += deltaTime;
        if (this.powerUpSpawnTimer >= this.powerUpSpawnInterval) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 0;
        }
        
        // 检查是否生成Boss
        if (!this.bossSpawned && this.gameMode === 'stage' && 
            this.enemiesKilledInStage >= this.enemiesNeededForBoss) {
            this.spawnBoss();
        }
        
        // 更新所有对象
        this.updateBullets(deltaTime);
        this.updateEnemies(deltaTime);
        this.updatePowerUps(deltaTime);
        this.updateParticles(deltaTime);
        
        if (this.boss) {
            this.boss.update(deltaTime);
            
            // Boss射击
            if (this.boss.canShoot(deltaTime)) {
                this.enemyBullets.push(...this.boss.shoot(this.player));
            }
            
            // 更新Boss血条
            this.updateBossHealthBar();
        }
        
        // 更新敌人子弹
        this.updateEnemyBullets(deltaTime);
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏结束
        if (this.player.lives <= 0) {
            this.gameOver();
        }
    }
    
    updateBullets(deltaTime) {
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.y > 0 && bullet.isActive;
        });
    }
    
    updateEnemyBullets(deltaTime) {
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.update(deltaTime);
            return bullet.y < this.canvas.height && bullet.isActive;
        });
    }
    
    updateEnemies(deltaTime) {
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(deltaTime);
            
            // 敌人射击
            if (enemy.canShoot(deltaTime)) {
                this.enemyBullets.push(...enemy.shoot(this.player));
            }
            
            return enemy.y < this.canvas.height + 50 && enemy.health > 0;
        });
    }
    
    updatePowerUps(deltaTime) {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.update(deltaTime);
            return powerUp.y < this.canvas.height && powerUp.isActive;
        });
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.life > 0;
        });
    }
    
    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 60) + 30;
        const type = Math.random() > 0.8 ? 'elite' : 'normal';
        const settings = this.difficultySettings[this.difficulty];
        this.enemies.push(new Enemy(x, -50, type, this.stage, settings));
    }
    
    spawnBoss() {
        this.bossSpawned = true;
        this.enemies = []; // 清除所有普通敌人
        const settings = this.difficultySettings[this.difficulty];
        this.boss = new Boss(this.canvas.width / 2, -100, this.stage, settings);
        document.getElementById('bossHealthBar').style.display = 'block';
    }
    
    spawnPowerUp() {
        const x = Math.random() * (this.canvas.width - 40) + 20;
        const types = ['weapon', 'shield', 'health'];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerUps.push(new PowerUp(x, -30, type));
    }
    
    checkCollisions() {
        // 玩家子弹 vs 敌人
        this.bullets.forEach(bullet => {
            if (!bullet.isActive) return;
            
            this.enemies.forEach(enemy => {
                if (this.checkCollision(bullet, enemy)) {
                    bullet.isActive = false;
                    enemy.takeDamage(bullet.damage);
                    
                    if (enemy.health <= 0) {
                        this.enemyDestroyed(enemy);
                    }
                    
                    this.createHitParticles(bullet.x, bullet.y);
                }
            });
            
            // 玩家子弹 vs Boss
            if (this.boss && this.checkCollision(bullet, this.boss)) {
                bullet.isActive = false;
                this.boss.takeDamage(bullet.damage);
                
                if (this.boss.health <= 0) {
                    this.bossDestroyed();
                }
                
                this.createHitParticles(bullet.x, bullet.y);
            }
        });
        
        // 敌人子弹 vs 玩家
        this.enemyBullets.forEach(bullet => {
            if (!bullet.isActive) return;
            
            if (this.checkCollision(bullet, this.player)) {
                bullet.isActive = false;
                this.player.takeDamage(1);
                this.createHitParticles(bullet.x, bullet.y, '#ff3366');
            }
        });
        
        // 敌人 vs 玩家
        this.enemies.forEach(enemy => {
            if (this.checkCollision(enemy, this.player)) {
                enemy.health = 0;
                this.player.takeDamage(1);
                this.createExplosion(enemy.x, enemy.y);
            }
        });
        
        // Boss vs 玩家
        if (this.boss && this.checkCollision(this.boss, this.player)) {
            this.player.takeDamage(1);
            this.createHitParticles(this.player.x, this.player.y, '#ff3366');
        }
        
        // 补给 vs 玩家
        this.powerUps.forEach(powerUp => {
            if (!powerUp.isActive) return;
            
            if (this.checkCollision(powerUp, this.player)) {
                powerUp.isActive = false;
                this.player.collectPowerUp(powerUp.type);
                this.updateUI();
                this.createCollectParticles(powerUp.x, powerUp.y, powerUp.color);
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        const distance = Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y);
        return distance < (obj1.radius || 20) + (obj2.radius || 20);
    }
    
    enemyDestroyed(enemy) {
        this.score += enemy.score;
        this.killCount++;
        this.enemiesKilledInStage++;
        this.createExplosion(enemy.x, enemy.y);
        this.updateUI();
    }
    
    bossDestroyed() {
        this.score += this.boss.score;
        this.killCount++;
        this.createExplosion(this.boss.x, this.boss.y, true);
        this.boss = null;
        this.bossSpawned = false;
        document.getElementById('bossHealthBar').style.display = 'none';
        
        // 闯关模式:显示关卡完成
        if (this.gameMode === 'stage') {
            this.stageClear();
        } else {
            // 无限模式:继续游戏,增加难度
            this.stage++;
            this.enemiesKilledInStage = 0;
            this.enemySpawnInterval = Math.max(500, this.enemySpawnInterval - 50);
        }
    }
    
    createExplosion(x, y, isBig = false) {
        const particleCount = isBig ? 50 : 20;
        const colors = ['#ff3366', '#ff6b9d', '#ffea00', '#00d4ff'];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = isBig ? Math.random() * 5 + 3 : Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push(new Particle(x, y, angle, speed, color));
        }
    }
    
    createHitParticles(x, y, color = '#00d4ff') {
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            this.particles.push(new Particle(x, y, angle, speed, color));
        }
    }
    
    createCollectParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.particles.push(new Particle(x, y, angle, speed, color));
        }
    }
    
    updateBossHealthBar() {
        if (!this.boss) return;
        
        const healthPercent = (this.boss.health / this.boss.maxHealth) * 100;
        document.getElementById('bossHealthFill').style.width = healthPercent + '%';
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('stage').textContent = this.stage;
        document.getElementById('weaponLevel').textContent = 'Lv.' + this.player.weaponLevel;
        
        // 更新生命值显示
        const livesContainer = document.getElementById('lives');
        livesContainer.innerHTML = '';
        for (let i = 0; i < this.player.lives; i++) {
            const heart = document.createElement('span');
            heart.className = 'life-icon';
            heart.textContent = '❤️';
            livesContainer.appendChild(heart);
        }
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星空背景
        this.renderStarfield();
        
        // 绘制所有对象
        this.particles.forEach(p => p.render(this.ctx));
        this.powerUps.forEach(p => p.render(this.ctx));
        this.bullets.forEach(b => b.render(this.ctx));
        this.enemyBullets.forEach(b => b.render(this.ctx));
        this.enemies.forEach(e => e.render(this.ctx));
        
        if (this.boss) {
            this.boss.render(this.ctx);
        }
        
        this.player.render(this.ctx);
    }
    
    renderStarfield() {
        // 简单的星空效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % this.canvas.width;
            const y = ((Date.now() * 0.05 + i * 50) % this.canvas.height);
            const size = (i % 3) + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            document.getElementById('pauseMenu').style.display = 'flex';
        } else {
            document.getElementById('pauseMenu').style.display = 'none';
        }
    }
    
    stageClear() {
        this.isPaused = true;
        document.getElementById('stageClearScore').textContent = this.score;
        document.getElementById('nextStage').textContent = this.stage + 1;
        document.getElementById('stageClearMenu').style.display = 'flex';
    }
    
    nextStage() {
        this.stage++;
        this.enemiesKilledInStage = 0;
        this.bossSpawned = false;
        this.isPaused = false;
        
        // 增加难度
        this.enemySpawnInterval = Math.max(500, this.enemySpawnInterval - 100);
        this.enemiesNeededForBoss += 5;
        
        document.getElementById('stageClearMenu').style.display = 'none';
        this.updateUI();
    }
    
    gameOver() {
        this.isRunning = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        
        // 显示游戏结束界面
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('killCount').textContent = this.killCount;
        
        if (this.gameMode === 'stage') {
            document.getElementById('stageReached').textContent = '到达关卡: ' + this.stage;
            document.getElementById('stageReached').style.display = 'block';
        } else {
            document.getElementById('stageReached').style.display = 'none';
        }
        
        document.getElementById('gameOverMenu').style.display = 'flex';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    restart() {
        document.getElementById('gameOverMenu').style.display = 'none';
        this.startGame(this.gameMode);
    }
    
    backToMenu() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('pauseMenu').style.display = 'none';
        document.getElementById('gameOverMenu').style.display = 'none';
        document.getElementById('stageClearMenu').style.display = 'none';
        document.getElementById('bossHealthBar').style.display = 'none';
        document.getElementById('startMenu').style.display = 'flex';
        
        // 更新最高分显示
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    showHelp() {
        document.getElementById('startMenu').style.display = 'none';
        document.getElementById('helpMenu').style.display = 'flex';
    }
    
    hideHelp() {
        document.getElementById('helpMenu').style.display = 'none';
        document.getElementById('startMenu').style.display = 'flex';
    }
}

// 玩家类
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 5;
        this.lives = 3;
        this.maxLives = 5;
        this.weaponLevel = 1;
        this.maxWeaponLevel = 5;
        this.hasShield = false;
        this.shootCooldown = 0;
        this.shootInterval = 150;
        this.color = '#00d4ff';
    }
    
    moveTo(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance > this.speed) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
        
        // 限制在画布内
        this.x = Math.max(this.radius, Math.min(game.canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(game.canvas.height - this.radius, this.y));
    }
    
    moveWithKeys(keys, deltaTime) {
        // 键盘控制移动
        let dx = 0;
        let dy = 0;
        
        if (keys.up) dy -= 1;
        if (keys.down) dy += 1;
        if (keys.left) dx -= 1;
        if (keys.right) dx += 1;
        
        // 如果有移动输入
        if (dx !== 0 || dy !== 0) {
            // 归一化对角线移动速度
            const length = Math.hypot(dx, dy);
            dx /= length;
            dy /= length;
            
            // 应用速度
            this.x += dx * this.speed;
            this.y += dy * this.speed;
            
            // 限制在画布内
            this.x = Math.max(this.radius, Math.min(game.canvas.width - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(game.canvas.height - this.radius, this.y));
        }
    }
    
    update(deltaTime) {
        this.shootCooldown -= deltaTime;
    }
    
    canShoot(deltaTime) {
        return this.shootCooldown <= 0;
    }
    
    shoot() {
        this.shootCooldown = this.shootInterval;
        const bullets = [];
        
        switch (this.weaponLevel) {
            case 1:
                bullets.push(new Bullet(this.x, this.y - this.radius, 0, -8, this.color, 1));
                break;
            case 2:
                bullets.push(new Bullet(this.x - 10, this.y - this.radius, 0, -8, this.color, 1));
                bullets.push(new Bullet(this.x + 10, this.y - this.radius, 0, -8, this.color, 1));
                break;
            case 3:
                bullets.push(new Bullet(this.x - 15, this.y - this.radius, 0, -8, this.color, 1));
                bullets.push(new Bullet(this.x, this.y - this.radius, 0, -8, this.color, 1));
                bullets.push(new Bullet(this.x + 15, this.y - this.radius, 0, -8, this.color, 1));
                break;
            case 4:
                bullets.push(new Bullet(this.x - 15, this.y - this.radius, -1, -8, this.color, 1));
                bullets.push(new Bullet(this.x - 5, this.y - this.radius, 0, -8, this.color, 1));
                bullets.push(new Bullet(this.x + 5, this.y - this.radius, 0, -8, this.color, 1));
                bullets.push(new Bullet(this.x + 15, this.y - this.radius, 1, -8, this.color, 1));
                break;
            case 5:
                bullets.push(new Bullet(this.x - 20, this.y - this.radius, -2, -8, this.color, 2));
                bullets.push(new Bullet(this.x - 10, this.y - this.radius, -1, -8, this.color, 2));
                bullets.push(new Bullet(this.x, this.y - this.radius, 0, -8, this.color, 2));
                bullets.push(new Bullet(this.x + 10, this.y - this.radius, 1, -8, this.color, 2));
                bullets.push(new Bullet(this.x + 20, this.y - this.radius, 2, -8, this.color, 2));
                break;
        }
        
        return bullets;
    }
    
    takeDamage(damage) {
        if (this.hasShield) {
            this.hasShield = false;
            return;
        }
        
        this.lives -= damage;
        if (this.lives < 0) this.lives = 0;
        game.updateUI();
    }
    
    collectPowerUp(type) {
        switch (type) {
            case 'weapon':
                if (this.weaponLevel < this.maxWeaponLevel) {
                    this.weaponLevel++;
                }
                break;
            case 'shield':
                this.hasShield = true;
                break;
            case 'health':
                if (this.lives < this.maxLives) {
                    this.lives++;
                }
                break;
        }
    }
    
    render(ctx) {
        // 绘制护盾
        if (this.hasShield) {
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 绘制飞机
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 机身
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.radius);
        ctx.lineTo(-this.radius * 0.6, this.radius);
        ctx.lineTo(0, this.radius * 0.7);
        ctx.lineTo(this.radius * 0.6, this.radius);
        ctx.closePath();
        ctx.fill();
        
        // 发光效果
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

// 子弹类
class Bullet {
    constructor(x, y, vx, vy, color, damage = 1) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 4;
        this.color = color;
        this.damage = damage;
        this.isActive = true;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// 敌机类
class Enemy {
    constructor(x, y, type, stage, settings) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = type === 'elite' ? 25 : 20;
        
        const speedMult = settings ? settings.speedMult : 1;
        const healthMult = settings ? settings.healthMult : 1;
        const scoreMult = settings ? settings.scoreMult : 1;
        
        this.speed = (1 + stage * 0.2) * speedMult;
        this.health = (type === 'elite' ? 3 : 1) * healthMult;
        this.maxHealth = this.health;
        this.score = Math.ceil((type === 'elite' ? 50 : 10) * scoreMult);
        this.color = type === 'elite' ? '#ff00ff' : '#ff3366';
        this.shootCooldown = 0;
        this.shootInterval = type === 'elite' ? 1500 : 2000;
    }
    
    update(deltaTime) {
        this.y += this.speed;
        this.shootCooldown -= deltaTime;
    }
    
    canShoot(deltaTime) {
        return this.shootCooldown <= 0;
    }
    
    shoot(player) {
        this.shootCooldown = this.shootInterval;
        const bullets = [];
        
        if (this.type === 'elite') {
            // 精英敌人发射3发子弹
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            bullets.push(new Bullet(this.x, this.y, Math.cos(angle - 0.2) * 4, Math.sin(angle - 0.2) * 4, this.color));
            bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * 4, Math.sin(angle) * 4, this.color));
            bullets.push(new Bullet(this.x, this.y, Math.cos(angle + 0.2) * 4, Math.sin(angle + 0.2) * 4, this.color));
        } else {
            // 普通敌人发射1发子弹
            bullets.push(new Bullet(this.x, this.y, 0, 3, this.color));
        }
        
        return bullets;
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    render(ctx) {
        // 绘制敌机
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.radius);
        ctx.lineTo(-this.radius * 0.6, -this.radius);
        ctx.lineTo(0, -this.radius * 0.7);
        ctx.lineTo(this.radius * 0.6, -this.radius);
        ctx.closePath();
        ctx.fill();
        
        // 发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        
        ctx.restore();
        
        // 绘制血条(精英敌人)
        if (this.type === 'elite' && this.health < this.maxHealth) {
            const barWidth = 40;
            const barHeight = 4;
            const healthPercent = this.health / this.maxHealth;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 10, barWidth, barHeight);
            
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(this.x - barWidth / 2, this.y - this.radius - 10, barWidth * healthPercent, barHeight);
        }
    }
}

// Boss类
class Boss {
    constructor(x, y, stage, settings) {
        this.x = x;
        this.y = y;
        this.radius = 50;
        this.speed = 2;
        this.direction = 1;
        
        const healthMult = settings ? settings.healthMult : 1;
        const scoreMult = settings ? settings.scoreMult : 1;
        
        this.health = (50 + stage * 20) * healthMult;
        this.maxHealth = this.health;
        this.score = Math.ceil(500 * scoreMult);
        this.color = '#ffea00';
        this.shootCooldown = 0;
        this.shootInterval = 800;
        this.moveTimer = 0;
    }
    
    update(deltaTime) {
        // 移动到屏幕上方
        if (this.y < 100) {
            this.y += this.speed;
        } else {
            // 左右移动
            this.moveTimer += deltaTime;
            this.x += this.direction * this.speed;
            
            if (this.x <= this.radius || this.x >= game.canvas.width - this.radius) {
                this.direction *= -1;
            }
        }
        
        this.shootCooldown -= deltaTime;
    }
    
    canShoot(deltaTime) {
        return this.y >= 100 && this.shootCooldown <= 0;
    }
    
    shoot(player) {
        this.shootCooldown = this.shootInterval;
        const bullets = [];
        
        // Boss发射圆形弹幕
        const bulletCount = 8;
        for (let i = 0; i < bulletCount; i++) {
            const angle = (Math.PI * 2 * i) / bulletCount;
            bullets.push(new Bullet(
                this.x,
                this.y,
                Math.cos(angle) * 3,
                Math.sin(angle) * 3,
                this.color
            ));
        }
        
        // 额外向玩家发射3发子弹
        const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
        bullets.push(new Bullet(this.x, this.y, Math.cos(angleToPlayer - 0.3) * 5, Math.sin(angleToPlayer - 0.3) * 5, this.color));
        bullets.push(new Bullet(this.x, this.y, Math.cos(angleToPlayer) * 5, Math.sin(angleToPlayer) * 5, this.color));
        bullets.push(new Bullet(this.x, this.y, Math.cos(angleToPlayer + 0.3) * 5, Math.sin(angleToPlayer + 0.3) * 5, this.color));
        
        return bullets;
    }
    
    takeDamage(damage) {
        this.health -= damage;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // 绘制Boss
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 3;
        
        // 主体
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 发光效果
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fill();
        
        // 装饰
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(-15, -15, 8, 0, Math.PI * 2);
        ctx.arc(15, -15, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// 补给类
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = 15;
        this.speed = 2;
        this.isActive = true;
        this.rotation = 0;
        
        switch (type) {
            case 'weapon':
                this.color = '#00d4ff';
                this.icon = '🔫';
                break;
            case 'shield':
                this.color = '#00ff88';
                this.icon = '🛡️';
                break;
            case 'health':
                this.color = '#ff3366';
                this.icon = '❤️';
                break;
        }
    }
    
    update(deltaTime) {
        this.y += this.speed;
        this.rotation += 0.05;
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 绘制光环
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制图标
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, 0, 0);
        
        ctx.restore();
    }
}

// 粒子类
class Particle {
    constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = 0.02;
        this.color = color;
        this.radius = Math.random() * 3 + 1;
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }
    
    render(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// 初始化游戏
const game = new Game();
