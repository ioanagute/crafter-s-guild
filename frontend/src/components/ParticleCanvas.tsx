'use client';

import React, { useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let W: number, H: number, particles: any[];

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const createParticle = () => {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.3,
                dx: (Math.random() - 0.5) * 0.25,
                dy: -Math.random() * 0.4 - 0.1,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.6 ? '#c9a44a' : Math.random() > 0.5 ? '#6b3a7d' : '#8b2a3a'
            };
        };

        particles = Array.from({ length: 80 }, createParticle);

        let animationFrameId: number;

        const drawParticles = () => {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                p.x += p.dx;
                p.y += p.dy;
                if (p.y < -4) {
                    p.y = H + 4;
                    p.x = Math.random() * W;
                }
                if (p.x < -4 || p.x > W + 4) p.dx *= -1;
            });
            animationFrameId = requestAnimationFrame(drawParticles);
        };

        drawParticles();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="particle-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
};

export default ParticleCanvas;
