// Celebratory Canvas Confetti System
export class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.pieces = [];
    this.active = false;
    this.rafId = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
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

  burst(count = 120, originX = 0.5, originY = 0.4) {
    this.resize();
    const colors = [
      '#F59E0B', '#FBBF24', '#FDE68A', // Golds
      '#EF4444', '#DC2626', '#B91C1C', // Reds
      '#10B981', '#34D399',             // Emeralds
      '#6366F1', '#818CF8',             // Indigo
      '#FFFFFF'                         // White sparks
    ];

    const ox = this.width * originX;
    const oy = this.height * originY;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 14 + 5;
      this.pieces.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 4,
        size: Math.random() * 9 + 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        gravity: 0.28,
        drag: 0.96,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.active) {
      this.active = true;
      this.animate();
    }
  }

  continuous(durationMs = 4000) {
    const start = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - start > durationMs) {
        clearInterval(interval);
        return;
      }
      this.burst(25, Math.random() * 0.8 + 0.1, 0.2);
    }, 200);
  }

  animate() {
    if (!this.active || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const p = this.pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity <= 0 || p.y > this.height + 50) {
        this.pieces.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.pieces.length > 0) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.active = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}
