// Vietnam Epic Visual Engine - Lac Hong Clouds, Chim Lac, Dong Son Drum & Stage Lighting
import { sound } from './sound.js';

export class VietnamVisualEngine {
  constructor() {
    this.canvas = document.getElementById('vietnamCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Clouds array (multi-layered parallax)
    this.clouds = [];
    this.cloudLayers = 3;

    // Lac Birds array
    this.birds = [];

    // Stage spotlights
    this.spotlights = [
      { x: 0.15, angle: 0.35, speed: 0.008, width: 140, intensity: 0.12 },
      { x: 0.85, angle: -0.35, speed: -0.007, width: 140, intensity: 0.12 },
      { x: 0.5, angle: 0, speed: 0.005, width: 220, intensity: 0.15 }
    ];

    // State modes: normal, intro, parting, steal, victory
    this.mode = 'normal';
    this.cloudPartOffset = 0;
    this.targetPartOffset = 0;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initClouds();
    this.initBirds();

    this.isRunning = true;
    this.animate();
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

  initClouds() {
    this.clouds = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * (this.width + 400) - 200,
        y: Math.random() * (this.height * 0.65),
        layer: (i % 3) + 1, // 1: far, 2: mid, 3: near
        speed: 0.15 + (i % 3) * 0.12,
        scale: 0.7 + Math.random() * 0.8,
        opacity: 0.12 + (i % 3) * 0.08,
        swirlAngle: Math.random() * Math.PI * 2
      });
    }
  }

  initBirds() {
    this.birds = [];
    // 3 subtle Lac birds soaring across the sky
    for (let i = 0; i < 3; i++) {
      this.birds.push({
        x: this.width + 100 + i * 280,
        y: 80 + Math.random() * (this.height * 0.45),
        speed: 0.65 + Math.random() * 0.35,
        scale: 0.45 + Math.random() * 0.3,
        opacity: 0.28 + Math.random() * 0.2,
        flapAngle: Math.random() * Math.PI * 2,
        isVictory: false
      });
    }
  }

  triggerVictoryFlock() {
    // Spawn 10 majestic Lac birds soaring upward
    for (let i = 0; i < 10; i++) {
      this.birds.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * (this.width * 0.6),
        y: this.height + 50 + Math.random() * 150,
        speed: 1.8 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 1.2,
        scale: 0.6 + Math.random() * 0.5,
        opacity: 0.55 + Math.random() * 0.35,
        flapAngle: Math.random() * Math.PI * 2,
        isVictory: true
      });
    }
    this.targetPartOffset = this.width * 0.6;
  }

  triggerCloudPart() {
    this.targetPartOffset = this.width * 0.55;
    setTimeout(() => {
      this.targetPartOffset = 0;
    }, 2800);
  }

  setStealMode(active) {
    this.mode = active ? 'steal' : 'normal';
  }

  drawStylizedCloud(x, y, scale, opacity) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = Math.max(0, Math.min(0.65, opacity));

    const grad = ctx.createLinearGradient(-150, 0, 150, 0);
    grad.addColorStop(0, 'rgba(253, 230, 138, 0.4)');
    grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(1, 'rgba(180, 83, 9, 0.05)');

    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.4)';
    ctx.lineWidth = 1.2;

    // Traditional cloud wisp contour
    ctx.beginPath();
    ctx.moveTo(-120, 20);
    ctx.bezierCurveTo(-140, -10, -100, -50, -60, -30);
    ctx.bezierCurveTo(-40, -70, 20, -70, 40, -35);
    ctx.bezierCurveTo(70, -60, 120, -40, 110, 0);
    ctx.bezierCurveTo(140, 10, 130, 50, 90, 45);
    ctx.bezierCurveTo(70, 65, 20, 60, -10, 40);
    ctx.bezierCurveTo(-40, 60, -90, 50, -120, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal golden cloud spiral
    ctx.beginPath();
    ctx.arc(-20, -5, 18, 0, Math.PI * 1.5, false);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.stroke();

    ctx.restore();
  }

  drawLacBird(b) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.scale, b.scale);
    ctx.globalAlpha = b.opacity;

    // Wing flap motion
    const wingDip = Math.sin(b.flapAngle) * 8;

    const goldGrad = ctx.createLinearGradient(0, 0, -80, 0);
    goldGrad.addColorStop(0, '#FDE68A');
    goldGrad.addColorStop(0.5, '#F59E0B');
    goldGrad.addColorStop(1, 'rgba(217, 119, 6, 0.4)');

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = '#FFF2A3';
    ctx.lineWidth = 1;

    // Long Dong Son Lac bird silhouette
    ctx.beginPath();
    // Head and long beak pointing left
    ctx.moveTo(-75, 0);
    ctx.quadraticCurveTo(-40, -5, -20, 2);
    // Upper wing
    ctx.quadraticCurveTo(-5, -35 + wingDip, 35, -45 + wingDip);
    ctx.quadraticCurveTo(15, -15, 10, 8);
    // Tail
    ctx.quadraticCurveTo(35, 10, 65, 8);
    ctx.quadraticCurveTo(45, 18, 5, 15);
    // Lower body to neck
    ctx.quadraticCurveTo(-35, 12, -75, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawSpotlights() {
    const ctx = this.ctx;
    const t = Date.now() * 0.001;

    this.spotlights.forEach((sp, i) => {
      const currentAngle = sp.angle + Math.sin(t * (1 + i * 0.3)) * 0.15;
      const originX = this.width * sp.x;
      const originY = -50;

      ctx.save();
      ctx.translate(originX, originY);
      ctx.rotate(currentAngle);

      const grad = ctx.createRadialGradient(0, 0, 10, 0, this.height * 0.8, sp.width * 2.5);
      grad.addColorStop(0, `rgba(253, 230, 138, ${sp.intensity * 1.5})`);
      grad.addColorStop(0.4, `rgba(245, 158, 11, ${sp.intensity * 0.8})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-sp.width * 0.3, 0);
      ctx.lineTo(sp.width * 0.3, 0);
      ctx.lineTo(sp.width * 2, this.height * 1.2);
      ctx.lineTo(-sp.width * 2, this.height * 1.2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  }

  animate() {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Stage spotlights in background
    this.drawSpotlights();

    // Smooth cloud parting interpolation
    this.cloudPartOffset += (this.targetPartOffset - this.cloudPartOffset) * 0.05;

    // 2. Parallax Lac Hong clouds
    const speedMult = this.mode === 'steal' ? 2.2 : 1.0;
    this.clouds.forEach(c => {
      c.x -= c.speed * speedMult;
      if (c.x < -250) {
        c.x = this.width + 250;
        c.y = Math.random() * (this.height * 0.65);
      }

      // Add parting offset if triggered
      const partShift = (c.x < this.width * 0.5 ? -1 : 1) * this.cloudPartOffset;
      this.drawStylizedCloud(c.x + partShift, c.y, c.scale, c.opacity);
    });

    // 3. Soaring Chim Lac
    for (let i = this.birds.length - 1; i >= 0; i--) {
      const b = this.birds[i];
      b.flapAngle += 0.08;

      if (b.isVictory) {
        b.y -= b.speed;
        b.x += b.vx;
        if (b.y < -100) {
          this.birds.splice(i, 1);
          continue;
        }
      } else {
        b.x -= b.speed;
        b.y += Math.sin(b.flapAngle * 0.5) * 0.4;
        if (b.x < -120) {
          b.x = this.width + 120 + Math.random() * 200;
          b.y = 80 + Math.random() * (this.height * 0.45);
        }
      }

      this.drawLacBird(b);
    }

    requestAnimationFrame(this.animate);
  }
}
