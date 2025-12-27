import { useEffect, useRef } from 'react';

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      time += 0.005;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time) * 100,
        height * 0.3 + Math.cos(time * 0.7) * 50,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );

      // Check if dark mode
      const isDark = document.documentElement.classList.contains('dark');
      
      if (isDark) {
        gradient.addColorStop(0, 'hsla(25, 95%, 53%, 0.15)');
        gradient.addColorStop(0.3, 'hsla(200, 90%, 50%, 0.08)');
        gradient.addColorStop(0.6, 'hsla(220, 20%, 10%, 0.5)');
        gradient.addColorStop(1, 'hsla(220, 20%, 8%, 1)');
      } else {
        gradient.addColorStop(0, 'hsla(25, 95%, 53%, 0.1)');
        gradient.addColorStop(0.3, 'hsla(200, 90%, 50%, 0.05)');
        gradient.addColorStop(0.6, 'hsla(0, 0%, 98%, 0.8)');
        gradient.addColorStop(1, 'hsla(0, 0%, 96%, 1)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add floating orbs
      const orbs = [
        { x: 0.2, y: 0.3, size: 200, hue: 25 },
        { x: 0.8, y: 0.6, size: 150, hue: 200 },
        { x: 0.5, y: 0.8, size: 180, hue: 35 },
      ];

      orbs.forEach((orb, i) => {
        const x = width * orb.x + Math.sin(time + i * 2) * 80;
        const y = height * orb.y + Math.cos(time * 0.8 + i) * 60;
        
        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, orb.size);
        
        if (isDark) {
          orbGradient.addColorStop(0, `hsla(${orb.hue}, 90%, 50%, 0.15)`);
          orbGradient.addColorStop(0.5, `hsla(${orb.hue}, 90%, 50%, 0.05)`);
          orbGradient.addColorStop(1, 'transparent');
        } else {
          orbGradient.addColorStop(0, `hsla(${orb.hue}, 90%, 60%, 0.12)`);
          orbGradient.addColorStop(0.5, `hsla(${orb.hue}, 90%, 60%, 0.03)`);
          orbGradient.addColorStop(1, 'transparent');
        }
        
        ctx.fillStyle = orbGradient;
        ctx.fillRect(0, 0, width, height);
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
