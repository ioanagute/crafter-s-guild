'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function UserBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const hideThreshold = 50;

      if (currentScroll <= 0) {
        setIsHidden(false);
        return;
      }

      if (Math.abs(currentScroll - lastScroll) < 10) {
        return;
      }

      setIsHidden(currentScroll > lastScroll && currentScroll > hideThreshold);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return (
    <div className={`user-bar ${isHidden ? 'user-bar--hidden' : ''}`}>
      <div className="user-bar__content">
        {isLoggedIn ? (
          <>
            <div className="user-bar__tabs">
              <Link href="/profile" className="user-bar__tab">Profile</Link>
              <button className="user-bar__tab" disabled>Settings</button>
              <Link href="/marketplace" className="user-bar__tab">Listings</Link>
              <button onClick={logout} className="user-bar__tab user-bar__tab--logout">Logout</button>
            </div>
            <div className="user-bar__user">
              <span className="user-bar__username">{user?.username}</span>
              <div className="avatar avatar--sm">{user?.avatar || 'A'}</div>
            </div>
          </>
        ) : (
          <Link href="/auth" className="btn btn--primary">
            <span className="sidebar__link-icon">In</span> Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
