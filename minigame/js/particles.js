// Ambient Particle Engine - Golden Embers & Celestial Dust
export class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 65;
    this.isRunning = false;
    this.rafId = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initParticles();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  createParticle(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 15,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.6 + 0.25,
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.7 + 0.2,
      maxOpacity: Math.random() * 0.6 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.3 ? 42 : 12, // Gold (42) or Crimson (12)
      glow: Math.random() > 0.5
    };
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  animate() {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      // Wrap around or recreate
      if (p.y < -20 || p.x < -20 || p.x > this.width + 20) {
        this.particles[i] = this.createParticle(false);
      }

      const alpha = Math.max(0.05, Math.min(p.maxOpacity, p.opacity));
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      if (p.glow) {
        this.ctx.shadowBlur = p.size * 6;
        this.ctx.shadowColor = p.hue === 42 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.7)';
      }

      this.ctx.fillStyle = p.hue === 42 
        ? `rgba(251, 191, 36, ${alpha})` 
        : `rgba(248, 113, 113, ${alpha * 0.8})`;
      this.ctx.fill();
      this.ctx.restore();
    }

    this.rafId = requestAnimationFrame(this.animate);
  }
}
