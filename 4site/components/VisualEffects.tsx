import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Particle, Firework } from '../types';

export interface VisualEffectsHandle {
  launchFirework: () => void;
  spawnHearts: (x: number, y: number) => void;
}

const VisualEffects = forwardRef<VisualEffectsHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const fallingHeartsRef = useRef<Particle[]>([]);
  const starsRef = useRef<{x: number, y: number, size: number, alpha: number, speed: number, offset: number}[]>([]);
  const messageStateRef = useRef<{ active: boolean, endTime: number, readyToTrigger: boolean }>({ 
      active: false, 
      endTime: 0,
      readyToTrigger: true 
  });
  
  const floorBucketsRef = useRef<number[]>([]);
  const bucketSize = 10; 

  useImperativeHandle(ref, () => ({
    launchFirework: () => {
      for(let i=0; i<3; i++) {
        setTimeout(() => {
            const scrollY = window.scrollY || window.pageYOffset;
            createFirework(
                Math.random() * window.innerWidth,
                scrollY + window.innerHeight
            );
        }, i * 300);
      }
    },
    spawnHearts: (x: number, y: number) => {
      createHeartExplosion(x, y);
    }
  }));

  const createFirework = (x: number, bottomY: number) => {
    const targetY = bottomY - (window.innerHeight * 0.5 + Math.random() * (window.innerHeight * 0.3));
    const particles: Particle[] = [];
    const colorHue = Math.random() * 360;
    
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const velocity = 3 + Math.random() * 4;
      particles.push({
        x: x,
        y: targetY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        color: `hsl(${colorHue}, 100%, ${60 + Math.random() * 20}%)`, 
        size: 2 + Math.random() * 3,
        type: 'firework'
      });
    }
    
    fireworksRef.current.push({
      x,
      y: targetY,
      particles,
      age: 0
    });
  };

  const createHeartExplosion = (x: number, y: number) => {
      const heartColors = ['#ffccd5', '#ffb3c1', '#ff8fa3', '#ff4d6d', '#e01e37'];
      
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 10; 
        
        const size = 8 + Math.random() * 12; 
        
        fallingHeartsRef.current.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity, 
            vy: (Math.sin(angle) * velocity) - 5, 
            alpha: 1,
            color: heartColors[Math.floor(Math.random() * heartColors.length)],
            size: size,
            type: 'heart',
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 20,
            stopped: false
        });
      }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const initStars = (w: number, h: number) => {
        starsRef.current = [];
        // Much denser stars (divided by 400 instead of 3000)
        const count = Math.floor((w * h) / 400); 
        for(let i=0; i<count; i++) {
            starsRef.current.push({
                x: Math.random() * w,
                y: Math.random() * h,
                // Much smaller stars (0.5 to 1.5px)
                size: 0.5 + Math.random() * 1.0, 
                alpha: 0.2 + Math.random() * 0.8,
                speed: 0.01 + Math.random() * 0.04,
                offset: Math.random() * Math.PI * 2
            });
        }
    }
    
    const initBuckets = (w: number) => {
        const bucketsCount = Math.ceil(w / bucketSize);
        if (floorBucketsRef.current.length !== bucketsCount) {
             floorBucketsRef.current = new Array(bucketsCount).fill(0);
        }
    };

    const resize = () => {
      const docHeight = Math.max(
          document.body.scrollHeight, 
          document.documentElement.scrollHeight, 
          document.body.offsetHeight, 
          document.documentElement.offsetHeight, 
          document.documentElement.clientHeight
      );
      
      if (canvas.width !== window.innerWidth || canvas.height !== docHeight) {
          canvas.width = window.innerWidth;
          canvas.height = docHeight;
          initBuckets(canvas.width);
          initStars(canvas.width, canvas.height);
      }
    };
    
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(document.body);
    window.addEventListener('resize', resize);
    
    setTimeout(resize, 100); 

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
        c.save();
        c.globalAlpha = alpha;
        c.translate(x, y);
        c.rotate((rotation * Math.PI) / 180);
        c.fillStyle = color;
        c.beginPath();
        const topCurveHeight = size * 0.3;
        c.moveTo(0, topCurveHeight);
        c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
        c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size * 1.5), 0, (size * 1.5));
        c.bezierCurveTo(0, (size * 1.5), size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
        c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
        c.fill();
        c.restore();
    }

    const drawMoon = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const moonX = canvas.width - 100;
        // Keep strictly fixed relative to screen
        const moonY = scrollY + 120; 
        const radius = 50;
        
        // Moon shimmer pulse
        const time = Date.now() * 0.001;
        const shimmer = 0.05 * Math.sin(time); 

        c.save();
        
        // Glow with shimmer
        const glow = c.createRadialGradient(moonX, moonY, radius * 0.8, moonX, moonY, radius * 3.5);
        glow.addColorStop(0, `rgba(255, 255, 240, ${0.4 + shimmer})`);
        glow.addColorStop(1, 'rgba(255, 255, 240, 0)');
        c.fillStyle = glow;
        c.beginPath();
        c.arc(moonX, moonY, radius * 3.5, 0, Math.PI * 2);
        c.fill();

        // Moon Body
        const moonGrad = c.createRadialGradient(moonX - 10, moonY - 10, radius * 0.2, moonX, moonY, radius);
        moonGrad.addColorStop(0, '#fffbeb');
        moonGrad.addColorStop(1, '#e2e8f0');
        c.fillStyle = moonGrad;
        c.beginPath();
        c.arc(moonX, moonY, radius, 0, Math.PI * 2);
        c.fill();

        // Craters
        c.fillStyle = 'rgba(200, 200, 210, 0.3)';
        [
            {cx: -15, cy: 5, r: 8}, 
            {cx: 10, cy: -10, r: 12}, 
            {cx: 20, cy: 15, r: 6},
            {cx: -5, cy: 25, r: 5}
        ].forEach(crater => {
            c.beginPath();
            c.arc(moonX + crater.cx, moonY + crater.cy, crater.r, 0, Math.PI * 2);
            c.fill();
        });

        c.restore();
    }
    
    const c = ctx;

    const animate = () => {
      c.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Background
      const gradient = c.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020617'); 
      gradient.addColorStop(0.3, '#172554'); 
      gradient.addColorStop(0.8, '#4a044e'); 
      gradient.addColorStop(1, '#2b0a15'); 
      c.fillStyle = gradient;
      c.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Stars
      c.fillStyle = '#ffffff';
      starsRef.current.forEach(star => {
          // Randomized twinkling
          // Use different sine frequencies and phases for randomness
          const twinkle = Math.sin((Date.now() * 0.003 * star.speed * 10) + star.offset);
          const opacity = 0.4 + 0.6 * Math.abs(twinkle);
          
          c.globalAlpha = opacity * star.alpha;
          c.beginPath();
          c.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          c.fill();
      });
      c.globalAlpha = 1;

      // 3. Moon
      drawMoon();

      // 4. Secret Message Logic
      const heartCount = fallingHeartsRef.current.length;
      const now = Date.now();

      // Trigger condition
      if (heartCount > 1500 && messageStateRef.current.readyToTrigger) {
          messageStateRef.current.active = true;
          messageStateRef.current.endTime = now + 60000; // 1 minute
          messageStateRef.current.readyToTrigger = false;
      }

      // Reset condition (if hearts drop below 1000, we can trigger again next time they go over 1500)
      if (heartCount < 1000 && !messageStateRef.current.active) {
          messageStateRef.current.readyToTrigger = true;
      }

      // Check timer expiration
      if (messageStateRef.current.active && now > messageStateRef.current.endTime) {
          messageStateRef.current.active = false;
      }

      // Draw Message
      if (messageStateRef.current.active) {
          const scrollY = window.scrollY || window.pageYOffset;
          const centerX = window.innerWidth / 2;
          const centerY = scrollY + window.innerHeight / 2;
          
          c.save();
          c.translate(centerX, centerY);
          
          // Softer heartbeat: 1.0 to 1.03 scale
          const scale = 1 + 0.03 * Math.sin(now * 0.003); 
          c.scale(scale, scale);
          
          c.font = "bold 50px 'Great Vibes', serif"; 
          c.textAlign = "center";
          c.textBaseline = "middle";
          
          // Smooth fade in/out if needed, but simple display is requested
          c.shadowColor = "#ff4d6d";
          c.shadowBlur = 40;
          c.fillStyle = "#ffffff";
          
          c.fillText("Я люблю тебя моя Шаритулька!♥️", 0, 0);
          c.restore();
      }
      
      // 5. Fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.age++;
        if (fw.age > 100) {
          fireworksRef.current.splice(i, 1);
          continue;
        }

        fw.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; 
          p.alpha -= 0.015;
          
          c.globalAlpha = Math.max(0, p.alpha);
          c.fillStyle = p.color;
          c.beginPath();
          c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          c.fill();
        });
      }

      // 6. Falling Hearts
      for (let i = fallingHeartsRef.current.length - 1; i >= 0; i--) {
        const p = fallingHeartsRef.current[i];
        
        if (p.stopped) {
            drawHeart(c, p.x, p.y, p.size, p.rotation || 0, p.color, 1);
            continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; 
        p.rotation = (p.rotation || 0) + (p.rotationSpeed || 0);

        if (p.x < 0 || p.x > canvas.width) p.vx *= -0.5;

        const bucketIndex = Math.floor(Math.max(0, Math.min(canvas.width - 1, p.x)) / bucketSize);
        const currentPileHeight = floorBucketsRef.current[bucketIndex] || 0;
        const floorY = canvas.height - currentPileHeight;

        if (p.y + p.size > floorY) {
            const leftH = floorBucketsRef.current[bucketIndex - 1] || 0;
            const rightH = floorBucketsRef.current[bucketIndex + 1] || 0;

            if (currentPileHeight > leftH + p.size) {
                 p.vx = -2;
                 p.y = floorY - p.size;
            } else if (currentPileHeight > rightH + p.size) {
                 p.vx = 2;
                 p.y = floorY - p.size;
            } else {
                p.y = floorY - p.size;
                p.stopped = true;
                
                const heightAdd = p.size * 0.5; 
                if (floorBucketsRef.current[bucketIndex] !== undefined) floorBucketsRef.current[bucketIndex] += heightAdd;
                if (floorBucketsRef.current[bucketIndex - 1] !== undefined) floorBucketsRef.current[bucketIndex - 1] += heightAdd * 0.3;
                if (floorBucketsRef.current[bucketIndex + 1] !== undefined) floorBucketsRef.current[bucketIndex + 1] += heightAdd * 0.3;
            }
        }

        drawHeart(c, p.x, p.y, p.size, p.rotation || 0, p.color, 1);
      }

      // 7. Limit hearts 
      if (fallingHeartsRef.current.length > 8000) {
           if (fallingHeartsRef.current[0].stopped) fallingHeartsRef.current.shift();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
      // Handled by parent
  };

  return (
    <canvas 
      ref={canvasRef}
      onClick={handleClick}
      className="absolute top-0 left-0 w-full z-0 pointer-events-none"
    />
  );
});

export default VisualEffects;