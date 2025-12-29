import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
}

export default function DreamDrawing(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 40, 1200);
      const height = Math.min(window.innerHeight - 200, 700);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const nodes: Node[] = [];
    const nodeCount = 8;
    const particleCount = 50;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 20 + Math.random() * 20,
        hue: (i * 360) / nodeCount,
      });
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        hue: Math.random() * 360,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Create fade effect instead of clearing
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < node.radius || node.x > width - node.radius) {
          node.vx *= -1;
          node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        }
        if (node.y < node.radius || node.y > height - node.radius) {
          node.vy *= -1;
          node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
        }

        // Draw connections to nearby nodes
        nodes.forEach((otherNode, j) => {
          if (i < j) {
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 250) {
              const opacity = (1 - distance / 250) * 0.3;
              const gradient = ctx.createLinearGradient(
                node.x,
                node.y,
                otherNode.x,
                otherNode.y
              );
              gradient.addColorStop(0, `hsla(${node.hue}, 70%, 60%, ${opacity})`);
              gradient.addColorStop(1, `hsla(${otherNode.hue}, 70%, 60%, ${opacity})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });

        // Draw node with glow
        const pulseSize = Math.sin(time * 2 + i) * 5;
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius + pulseSize
        );
        gradient.addColorStop(0, `hsla(${node.hue}, 80%, 70%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${node.hue}, 70%, 60%, 0.4)`);
        gradient.addColorStop(1, `hsla(${node.hue}, 60%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = `hsla(${node.hue}, 100%, 80%, 0.9)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Attract to nearest node
        let nearestNode = nodes[0];
        let minDist = Infinity;
        nodes.forEach((node) => {
          const dx = node.x - particle.x;
          const dy = node.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearestNode = node;
          }
        });

        if (minDist < 150) {
          const dx = nearestNode.x - particle.x;
          const dy = nearestNode.y - particle.y;
          particle.vx += (dx / minDist) * 0.01;
          particle.vy += (dy / minDist) * 0.01;
        }

        // Limit velocity
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        if (speed > 3) {
          particle.vx = (particle.vx / speed) * 3;
          particle.vy = (particle.vy / speed) * 3;
        }

        // Draw particle
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, 0.8)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle trail
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, 0.2)`;
        ctx.beginPath();
        ctx.arc(
          particle.x - particle.vx * 2,
          particle.y - particle.vy * 2,
          particle.size * 0.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Draw flowing code symbols
      ctx.font = '14px monospace';
      ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
      const symbols = ['<', '>', '{', '}', '(', ')', '=>', '[]', '...'];
      for (let i = 0; i < 15; i++) {
        const x = (time * 50 + i * 80) % width;
        const y = 50 + (i * 37) % (height - 100);
        const symbol = symbols[i % symbols.length];
        ctx.fillText(symbol, x, y);
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [dimensions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>What I Dream Of</h2>
        <p className={styles.subtitle}>
          A visualization of connection, creativity, and the beauty of code
        </p>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.dot} style={{ background: '#60a5fa' }} />
          <span>Nodes represent ideas and concepts</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.line} />
          <span>Connections form when ideas are close</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.particle} />
          <span>Particles flow toward inspiration</span>
        </div>
      </div>
    </div>
  );
}
