import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  col: string;
};

const COLORS = ['#FEE622', '#FB8C05', '#fff5a0', '#FFD700', '#ff9800'];
const COUNT = 110;

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const makeParticle = (atBottom: boolean): Particle => {
      const maxLife = 100 + Math.random() * 180;
      return {
        x: Math.random() * canvas.width,
        y: atBottom ? canvas.height + Math.random() * 40 : Math.random() * canvas.height,
        r: 0.3 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.38,
        vy: -(Math.random() * 0.75 + 0.15),
        life: Math.random() * maxLife,
        maxLife,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const particles: Particle[] = Array.from({ length: COUNT }, () => makeParticle(false));

    let rafId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          particles[i] = makeParticle(true);
          continue;
        }

        const a = (p.life / p.maxLife) * 0.8;
        const alphaHex = Math.round(a * 255)
          .toString(16)
          .padStart(2, '0');

        ctx.beginPath();
        ctx.fillStyle = p.col + alphaHex;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
};

export default ParticleCanvas;
