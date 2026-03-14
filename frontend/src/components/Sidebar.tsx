'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

const links = [
  { id: 'home', href: '/', icon: 'H', label: 'Home', section: 'Navigate' },
  { id: 'categories', href: '/categories', icon: 'C', label: 'Categories', section: null },
  { id: 'threads', href: '/threads', icon: 'T', label: 'Threads', section: null },
  { id: 'marketplace', href: '/marketplace', icon: 'M', label: 'Marketplace', section: 'Discover' },
  { id: 'events', href: '/events', icon: 'E', label: 'Events', section: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [clock, setClock] = useState('00:00:00');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <aside className={`sidebar glass ${isOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo text-gradient">
            Crafter&apos;s<br />Guild
            <span>Est. MMXXIV</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          <button className="sidebar__search-btn" id="search-btn">
            Search the Guild <span className="kbd">/</span>
          </button>
          {links.reduce((acc: React.ReactNode[], link, index) => {
            if (link.section) {
              acc.push(<div key={`section-${index}`} className="sidebar__section-label">{link.section}</div>);
            }
            const isActive = pathname === link.href;
            acc.push(
              <Link
                key={link.id}
                href={link.href}
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="sidebar__link-icon">{link.icon}</span> {link.label}
              </Link>,
            );
            return acc;
          }, [])}

          {isLoggedIn ? (
            <div className="sidebar__mobile-only">
              <div className="sidebar__section-label">Account</div>
              <Link href="/profile" className="sidebar__link" onClick={() => setIsOpen(false)}>
                <span className="sidebar__link-icon">P</span> Profile
              </Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="sidebar__link sidebar__link--logout">
                <span className="sidebar__link-icon">L</span> Logout
              </button>
            </div>
          ) : (
            <div className="sidebar__account">
              <div className="sidebar__section-label">Account</div>
              <Link href="/auth" className="sidebar__link" onClick={() => setIsOpen(false)}>
                <span className="sidebar__link-icon">In</span> Sign In
              </Link>
            </div>
          )}
        </nav>
        <div className="sidebar__guild-clock" id="guild-clock">{clock}</div>
        <div className="sidebar__footer">
          <p>Built for makers</p>
        </div>
      </aside>

      <button
        className="hamburger"
        id="hamburger"
        aria-label="Toggle navigation"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}
    </>
  );
}
