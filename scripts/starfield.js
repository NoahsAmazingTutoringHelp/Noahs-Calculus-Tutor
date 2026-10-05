const fallbackContainer = document.createElement('div');
const starfieldState = {
    canvas: null,
    ctx: null,
    stars: [],
    rafId: null,
    width: 0,
    height: 0,
    acceleration: 1,
    targetAcceleration: 1,
    lastFrameAt: 0
};
const baseStarfieldConfig = {
    container: fallbackContainer,
    auto: true,
    originX: 0,
    originY: 0,
    numStars: 600,
    baseSpeed: 1.1,
    trailLength: 0.9,
    starColor: 'rgb(220, 220, 220)',
    canvasColor: 'rgba(0, 0, 0, 0)',
    hueJitter: 12,
    maxAcceleration: 10,
    accelerationRate: 0.28,
    decelerationRate: 0.22,
    minSpawnRadius: 24,
    maxSpawnRadius: 720
};
function cloneStarfieldConfig(config) {
    return {
        ...config
    };
}
function getCanvasSize(container) {
    const width = Math.max(1, container.clientWidth || window.innerWidth || 1);
    const height = Math.max(1, container.clientHeight || window.innerHeight || 1);
    return { width, height };
}
function parseRgb(color) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) {
        return [220, 220, 220];
    }
    return [
        Number(match[0]) || 220,
        Number(match[1]) || 220,
        Number(match[2]) || 220
    ];
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}
function getMaxTravelDistance() {
    const diagonal = Math.hypot(starfieldState.width, starfieldState.height);
    return Math.max(diagonal * 0.7, Starfield.config.maxSpawnRadius);
}
function resetStar(star, randomRadius = true) {
    const config = Starfield.config;
    const spread = Math.max(config.minSpawnRadius, config.maxSpawnRadius);
    const spawnProgress = randomRadius ? Math.random() * Math.random() : 0;
    star.angle = Math.random() * Math.PI * 2;
    star.radius = config.minSpawnRadius + (spread - config.minSpawnRadius) * spawnProgress;
    star.speed = randomBetween(0.6, 1.6);
    star.size = randomBetween(0.7, 2.3);
    star.opacity = randomBetween(0.18, 0.9);
    star.tintShift = randomBetween(-config.hueJitter, config.hueJitter);
}
function buildStars(count) {
    const stars = [];
    for (let index = 0; index < count; index += 1) {
        const star = {
            angle: 0,
            radius: 0,
            speed: 1,
            size: 1,
            opacity: 1,
            tintShift: 0
        };
        resetStar(star, true);
        stars.push(star);
    }
    return stars;
}
function syncCanvasDimensions() {
    const canvas = starfieldState.canvas;
    const ctx = starfieldState.ctx;
    const container = Starfield.config.container;
    if (!canvas || !ctx || !container) {
        return;
    }
    const { width, height } = getCanvasSize(container);
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    starfieldState.width = width;
    starfieldState.height = height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}
function drawStar(star) {
    const ctx = starfieldState.ctx;
    if (!ctx) {
        return;
    }
    const config = Starfield.config;
    const [baseR, baseG, baseB] = parseRgb(config.starColor);
    const maxDistance = getMaxTravelDistance();
    const speed = config.baseSpeed * starfieldState.acceleration * star.speed;
    const trailDistance = clamp(speed * config.trailLength * 11, 4, 70);
    star.radius += speed;
    if (star.radius > maxDistance) {
        resetStar(star, false);
        return;
    }
    const x = config.originX + Math.cos(star.angle) * star.radius;
    const y = config.originY + Math.sin(star.angle) * star.radius;
    const previousRadius = Math.max(0, star.radius - trailDistance);
    const tailX = config.originX + Math.cos(star.angle) * previousRadius;
    const tailY = config.originY + Math.sin(star.angle) * previousRadius;
    const alpha = clamp(star.opacity + (star.radius / maxDistance) * 0.35, 0.1, 1);
    const colorR = clamp(baseR + star.tintShift, 0, 255);
    const colorG = clamp(baseG + star.tintShift, 0, 255);
    const colorB = clamp(baseB + star.tintShift, 0, 255);
    ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${alpha * 0.48})`;
    ctx.lineWidth = Math.max(0.8, star.size * 0.9);
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fillStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
}
function updateAcceleration() {
    const config = Starfield.config;
    const direction = starfieldState.targetAcceleration > starfieldState.acceleration ? 1 : -1;
    if (starfieldState.acceleration === starfieldState.targetAcceleration) {
        return;
    }
    const step = direction > 0
        ? Math.max(0.01, config.accelerationRate)
        : Math.max(0.01, config.decelerationRate);
    starfieldState.acceleration = clamp(starfieldState.acceleration + direction * step, 1, config.maxAcceleration);
    if (Math.abs(starfieldState.acceleration - starfieldState.targetAcceleration) < 0.05) {
        starfieldState.acceleration = starfieldState.targetAcceleration;
    }
}
function renderStarfield(now) {
    const ctx = starfieldState.ctx;
    const canvas = starfieldState.canvas;
    if (!ctx || !canvas || !canvas.isConnected) {
        Starfield.cleanup();
        return;
    }
    const elapsed = now - starfieldState.lastFrameAt;
    starfieldState.lastFrameAt = now;
    if (elapsed > 220) {
        starfieldState.lastFrameAt = now - 16;
    }
    updateAcceleration();
    ctx.clearRect(0, 0, starfieldState.width, starfieldState.height);
    ctx.fillStyle = Starfield.config.canvasColor;
    ctx.fillRect(0, 0, starfieldState.width, starfieldState.height);
    for (const star of starfieldState.stars) {
        drawStar(star);
    }
    starfieldState.rafId = window.requestAnimationFrame(renderStarfield);
}
const Starfield = {
    config: cloneStarfieldConfig(baseStarfieldConfig),
    setup(config) {
        this.cleanup();
        this.config = cloneStarfieldConfig(config);
        starfieldState.acceleration = 1;
        starfieldState.targetAcceleration = 1;
        const canvas = document.createElement('canvas');
        canvas.className = 'starfield-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Unable to create a 2D context for starfield rendering.');
        }
        starfieldState.canvas = canvas;
        starfieldState.ctx = ctx;
        starfieldState.lastFrameAt = performance.now();
        this.config.container.appendChild(canvas);
        syncCanvasDimensions();
        starfieldState.stars = buildStars(Math.max(10, this.config.numStars));
        starfieldState.rafId = window.requestAnimationFrame(renderStarfield);
    },
    cleanup() {
        if (starfieldState.rafId !== null) {
            window.cancelAnimationFrame(starfieldState.rafId);
            starfieldState.rafId = null;
        }
        if (starfieldState.canvas && starfieldState.canvas.parentElement) {
            starfieldState.canvas.parentElement.removeChild(starfieldState.canvas);
        }
        starfieldState.canvas = null;
        starfieldState.ctx = null;
        starfieldState.stars = [];
        starfieldState.width = 0;
        starfieldState.height = 0;
        starfieldState.acceleration = 1;
        starfieldState.targetAcceleration = 1;
    },
    resize(width, height) {
        starfieldState.width = Math.max(1, width);
        starfieldState.height = Math.max(1, height);
        syncCanvasDimensions();
        if (starfieldState.stars.length !== this.config.numStars) {
            starfieldState.stars = buildStars(Math.max(10, this.config.numStars));
        }
    },
    setOrigin(x, y) {
        this.config.originX = x;
        this.config.originY = y;
    },
    setAccelerate(active) {
        this.config.maxAcceleration = Math.max(1, this.config.maxAcceleration);
        starfieldState.targetAcceleration = active ? this.config.maxAcceleration : 1;
    }
};
window.Starfield = Starfield;
