'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import RouteBadge from '@/components/ui/RouteBadge';
import { useAuth } from '@/context/AuthContext';
import { memberRoutes, primaryRoutes } from '@/lib/navigation';

type SidebarProps = {
  isCollapsed: boolean;
  onCollapseChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isCollapsed, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
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

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    if (href === '/threads') {
      return pathname === '/threads' || pathname.startsWith('/threads/');
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <aside
        className={`sidebar sidebar--refined glass ${isOpen ? 'open' : ''} ${isCollapsed ? 'sidebar--collapsed' : ''}`}
        id="sidebar"
      >
        <div className="sidebar__brand">
          <div className="sidebar__crest">
            <RouteBadge tone="home" label="Crafter's Guild crest" />
          </div>
          <div className="sidebar__logo">
            Crafter&apos;s Guild
            <span>Forged Records for Artisans of the Realm</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          {primaryRoutes.reduce((acc: React.ReactNode[], link, index) => {
            if (link.section) {
              acc.push(<div key={`section-${index}`} className="sidebar__section-label">{link.section}</div>);
            }
            const isActive = isLinkActive(link.href);
            acc.push(
              <Link
                key={link.id}
                href={link.href}
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                onClick={() => setIsOpen(false)}
                aria-label={link.a11yLabel}
              >
                <span className="sidebar__link-icon">
                  <RouteBadge tone={link.tone} label={link.label} compact />
                </span>
                <span className="sidebar__link-copy">
                  <span className="sidebar__link-title">{link.label}</span>
                  <span className="sidebar__link-desc">{link.description}</span>
                </span>
              </Link>,
            );
            return acc;
          }, [])}

          {isLoggedIn ? (
            <div className="sidebar__mobile-only">
              <div className="sidebar__section-label">Member Ledger</div>
              <Link href="/profile" className="sidebar__link" onClick={() => setIsOpen(false)}>
                <span className="sidebar__link-icon">
                  <RouteBadge tone={memberRoutes.profile.tone} label={memberRoutes.profile.label} compact />
                </span>
                <span className="sidebar__link-copy">
                  <span className="sidebar__link-title">{memberRoutes.profile.label}</span>
                  <span className="sidebar__link-desc">Inspect your standing and current records</span>
                </span>
              </Link>
              <button onClick={() => { void logout(); setIsOpen(false); }} className="sidebar__link sidebar__link--logout">
                <span className="sidebar__link-icon">
                  <RouteBadge tone={memberRoutes.leave.tone} label={memberRoutes.leave.label} compact />
                </span>
                <span className="sidebar__link-copy">
                  <span className="sidebar__link-title">{memberRoutes.leave.label}</span>
                  <span className="sidebar__link-desc">Close your current guild session</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="sidebar__account">
              <div className="sidebar__section-label">Member Ledger</div>
              <Link href="/auth" className="sidebar__link" onClick={() => setIsOpen(false)}>
                <span className="sidebar__link-icon">
                  <RouteBadge tone={memberRoutes.enter.tone} label={memberRoutes.enter.label} compact />
                </span>
                <span className="sidebar__link-copy">
                  <span className="sidebar__link-title">{memberRoutes.enter.label}</span>
                  <span className="sidebar__link-desc">Sign in or register a new guild member</span>
                </span>
              </Link>
            </div>
          )}
        </nav>
        <div className="sidebar__guild-clock" id="guild-clock">
          <span className="sidebar__clock-label">Hall Clock</span>
          <span className="sidebar__clock-time">{clock}</span>
        </div>
        <div className="sidebar__footer">
          <p>Guild records maintained for makers, merchants, and masters.</p>
        </div>
      </aside>

      <button
        className="sidebar-collapse-toggle"
        type="button"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-pressed={isCollapsed}
        onClick={() => onCollapseChange((value) => !value)}
      >
        {isCollapsed ? 'Expand' : 'Collapse'}
      </button>

      <button
        className="hamburger"
        id="hamburger"
        type="button"
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
