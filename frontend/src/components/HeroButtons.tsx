'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HeroButtons() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="cta-row">
      {isLoggedIn ? (
        <Link href="/marketplace" className="btn btn--primary btn--glow">Visit the Bazaar</Link>
      ) : (
        <Link href="/auth" className="btn btn--primary btn--glow">Join the Guild</Link>
      )}
      <Link href="/threads" className="btn btn--secondary">Enter the Forum</Link>
    </div>
  );
}
