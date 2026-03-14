'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HeroButtons() {
  const { isLoggedIn } = useAuth();

  return (
    <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
      {isLoggedIn ? (
        <Link href="/marketplace" className="btn btn--primary btn--glow">Go to Marketplace</Link>
      ) : (
        <Link href="/auth" className="btn btn--primary btn--glow">Join the Guild</Link>
      )}
      <Link href="/threads" className="btn">Browse Threads</Link>
    </div>
  );
}
