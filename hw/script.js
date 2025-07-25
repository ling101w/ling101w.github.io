document.addEventListener('DOMContentLoaded', function() {
    // 设置倒计时结束时间：2025年7月31日18:00:00
    const endDate = new Date('2025-07-31T18:00:00').getTime();
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    // 更新倒计时函数
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endDate - now;

        // 如果倒计时结束
        if (timeLeft <= 0) {
            document.getElementById('countdown').innerHTML = '<div class="ended">侠客已归隐江湖</div>';
            return;
        }

        // 计算剩余时间
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // 更新显示，确保两位数格式
        countdownElements.days.textContent = days.toString().padStart(2, '0');
        countdownElements.hours.textContent = hours.toString().padStart(2, '0');
        countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
        countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    // 立即更新一次并每秒更新
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 飘落花瓣效果
    function createPetals() {
        const petalsContainer = document.querySelector('.petals-container');
        const petalSymbols = ['🌸', '🌺', '🌼', '🍃', '🌿'];
        
        function createPetal() {
            const petal = document.createElement('div');
            petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
            petal.style.position = 'absolute';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = '-50px';
            petal.style.fontSize = (Math.random() * 20 + 15) + 'px';
            petal.style.opacity = Math.random() * 0.7 + 0.3;
            petal.style.pointerEvents = 'none';
            petal.style.zIndex = '1';
            petal.style.animation = `petalFall ${Math.random() * 10 + 8}s linear infinite`;
            petal.style.animationDelay = Math.random() * 5 + 's';
            
            petalsContainer.appendChild(petal);
            
            // 移除花瓣
            setTimeout(() => {
                if (petal.parentNode) {
                    petal.parentNode.removeChild(petal);
                }
            }, 15000);
        }
        
        // 定期创建花瓣
        setInterval(createPetal, 2000);
        
        // 添加花瓣飘落动画CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes petalFall {
                0% {
                    transform: translateY(-50px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 启动花瓣效果
    createPetals();

    // 粒子背景效果 - 武侠风格
    const canvas = document.getElementById('particle-bg');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let canvasWidth, canvasHeight;

    // 设置canvas尺寸
    function resizeCanvas() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 鼠标位置跟踪
    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // 武侠风格粒子类
    class AncientParticle {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            
            // 武侠风格颜色：金色、红色、橙色
            const colors = [
                'rgba(255, 215, 0, ',     // 金色
                'rgba(255, 140, 0, ',     // 橙色
                'rgba(220, 20, 60, ',     // 深红色
                'rgba(255, 69, 0, ',      // 红橙色
                'rgba(184, 134, 11, '     // 深金色
            ];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = this.baseColor + this.opacity + ')';
            
            this.originalSpeedX = this.speedX;
            this.originalSpeedY = this.speedY;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.02 - 0.01;
        }

        update() {
            // 鼠标交互 - 粒子聚集效果（武侠气功效果）
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = forceDirectionX * force * 0.3;
                    let directionY = forceDirectionY * force * 0.3;
                    
                    // 向鼠标聚集而不是排斥
                    this.speedX += directionX;
                    this.speedY += directionY;
                    
                    // 增强发光效果
                    this.opacity = Math.min(1, this.opacity + 0.02);
                } else {
                    // 恢复原始状态
                    this.speedX += (this.originalSpeedX - this.speedX) * 0.02;
                    this.speedY += (this.originalSpeedY - this.speedY) * 0.02;
                    this.opacity += (Math.random() * 0.6 + 0.2 - this.opacity) * 0.01;
                }
            }

            // 添加轻微的旋转运动
            this.angle += this.angleSpeed;
            this.x += this.speedX + Math.sin(this.angle) * 0.1;
            this.y += this.speedY + Math.cos(this.angle) * 0.1;

            // 边界检测
            if (this.x < 0) this.x = canvasWidth;
            if (this.x > canvasWidth) this.x = 0;
            if (this.y < 0) this.y = canvasHeight;
            if (this.y > canvasHeight) this.y = 0;
            
            // 更新颜色
            this.color = this.baseColor + this.opacity + ')';
        }

        draw() {
            // 绘制发光效果
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            // 外层光晕
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + (this.opacity * 0.1) + ')';
            ctx.fill();
            
            // 中层光晕
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + (this.opacity * 0.3) + ')';
            ctx.fill();
            
            // 核心粒子
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            ctx.restore();
        }
    }

    // 创建粒子数组
    function initParticles() {
        particlesArray = [];
        const particleCount = Math.floor((canvasWidth * canvasHeight) / 12000);
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new AncientParticle());
        }
    }

    // 动画循环
    function animateParticles() {
        // 创建渐变背景效果
        ctx.fillStyle = 'rgba(26, 26, 46, 0.05)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        // 粒子连线效果 - 武侠风格
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    ctx.save();
                    ctx.globalCompositeOperation = 'screen';
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 215, 0, ' + (1 - distance/80) * 0.3 + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    // 初始化并开始动画
    initParticles();
    animateParticles();
    
    // 添加点击特效
    document.addEventListener('click', function(e) {
        createClickEffect(e.clientX, e.clientY);
    });
    
    function createClickEffect(x, y) {
        const effectParticles = [];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            effectParticles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 3 + 1,
                color: 'rgba(255, 215, 0, '
            });
        }
        
        function animateClickEffect() {
            for (let i = effectParticles.length - 1; i >= 0; i--) {
                const p = effectParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.vy += 0.1; // 重力效果
                
                if (p.life <= 0) {
                    effectParticles.splice(i, 1);
                    continue;
                }
                
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.life + ')';
                ctx.fill();
                ctx.restore();
            }
            
            if (effectParticles.length > 0) {
                requestAnimationFrame(animateClickEffect);
            }
        }
        
        animateClickEffect();
    }

    // Security Badge 点击动效
    const securityBadge = document.querySelector('.security-badge');
    if (securityBadge) {
        securityBadge.addEventListener('click', function(e) {
            // 防止重复触发
            if (this.classList.contains('clicked')) {
                return;
            }
            
            // 添加点击动画类
            this.classList.add('clicked');
            
            // 创建特殊的点击粒子效果
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            createBadgeClickEffect(centerX, centerY);
            
            // 动画结束后移除类
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 800);
            
            // 阻止事件冒泡，避免触发全局点击效果
            e.stopPropagation();
        });
    }
    
    function createBadgeClickEffect(x, y) {
        const effectParticles = [];
        const particleCount = 25;
        
        // 创建更华丽的粒子效果
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 6 + 3;
            effectParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.015 + 0.008,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? 'rgba(255, 215, 0, ' : 'rgba(255, 69, 0, ',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
        
        // 添加中心爆炸效果
        for (let i = 0; i < 10; i++) {
            effectParticles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 6 + 3,
                color: 'rgba(255, 140, 0, ',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3
            });
        }
        
        function animateBadgeEffect() {
            for (let i = effectParticles.length - 1; i >= 0; i--) {
                const p = effectParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.vy += 0.08; // 轻微重力
                p.vx *= 0.99; // 阻力
                p.rotation += p.rotationSpeed;
                
                if (p.life <= 0) {
                    effectParticles.splice(i, 1);
                    continue;
                }
                
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                
                // 绘制星形粒子
                ctx.beginPath();
                for (let j = 0; j < 5; j++) {
                    const angle = (j * Math.PI * 2) / 5;
                    const x1 = Math.cos(angle) * p.size;
                    const y1 = Math.sin(angle) * p.size;
                    const x2 = Math.cos(angle + Math.PI / 5) * p.size * 0.5;
                    const y2 = Math.sin(angle + Math.PI / 5) * p.size * 0.5;
                    
                    if (j === 0) {
                        ctx.moveTo(x1, y1);
                    } else {
                        ctx.lineTo(x1, y1);
                    }
                    ctx.lineTo(x2, y2);
                }
                ctx.closePath();
                ctx.fillStyle = p.color + p.life + ')';
                ctx.fill();
                
                // 添加光晕效果
                ctx.beginPath();
                ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = p.color + (p.life * 0.3) + ')';
                ctx.fill();
                
                ctx.restore();
            }
            
            if (effectParticles.length > 0) {
                requestAnimationFrame(animateBadgeEffect);
            }
        }
        
        animateBadgeEffect();
    }
});