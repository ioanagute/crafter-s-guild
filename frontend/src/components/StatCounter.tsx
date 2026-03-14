'use client';

import React, { useEffect, useRef, useState } from 'react';

const StatCounter = ({ target, label }: { target: number; label: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!countRef.current || hasAnimated) {
      return;
    }

    const animate = () => {
      const duration = 1800;
      const start = performance.now();
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(ease(progress) * target);
        setCount(value);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, target]);

  return (
    <div className="card profile-stat animate-fade-in-up">
      <span ref={countRef} className="profile-stat__value">
        {count.toLocaleString()}
      </span>
      <span className="profile-stat__label">{label}</span>
    </div>
  );
};

export default StatCounter;
