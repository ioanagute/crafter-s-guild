'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MemberChip from '@/components/ui/MemberChip';
import RouteBadge from '@/components/ui/RouteBadge';
import { useAuth } from '@/context/AuthContext';
import { memberRoutes, primaryRoutes } from '@/lib/navigation';

const sectionMap: Array<{ match: RegExp; label: string }> = [
  { match: /^\/$/, label: 'Guild Home' },
  { match: /^\/threads(\/|$)/, label: 'Forum Records' },
  { match: /^\/categories(\/|$)/, label: 'Craft Halls' },
  { match: /^\/marketplace(\/|$)/, label: 'Dark Bazaar' },
  { match: /^\/events(\/|$)/, label: 'Guild Gatherings' },
  { match: /^\/profile(\/|$)/, label: 'Member Ledger' },
  { match: /^\/auth(\/|$)/, label: 'Guild Entry' },
];

export default function UserBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const currentSection =
    sectionMap.find((item) => item.match.test(pathname))?.label || 'Crafter\'s Guild';
  const currentRoute = primaryRoutes.find((item) => {
    if (item.href === '/') return pathname === '/';
    if (item.href === '/threads') return pathname === '/threads' || pathname.startsWith('/threads/');
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
  const memberStatus = user?.role === 'ADMIN' ? 'Guild Administrator' : 'Guild Member';

  return (
    <div className={`user-bar glass ${isHidden ? 'user-bar--hidden' : ''}`}>
      <div className="user-bar__content">
        <Link href="/" className="user-bar__mobile-logo text-gradient">
          Crafter&apos;s Guild
        </Link>
        <div className="user-bar__section">
          <span className="user-bar__section-label">Current Hall</span>
          <div className="user-bar__section-head">
            <RouteBadge tone={currentRoute?.tone || 'home'} label={currentSection} compact />
            <span className="user-bar__section-name">{currentSection}</span>
          </div>
        </div>
        <div className="user-bar__utility">
          {isLoggedIn ? (
            <div className="user-bar__member-menu" ref={menuRef}>
              <MemberChip
                username={user?.username || 'Guild Member'}
                avatar={user?.avatar || 'A'}
                status={memberStatus}
                onClick={() => setIsMenuOpen((current) => !current)}
                expanded={isMenuOpen}
                controls="guild-member-menu"
              />
              <div
                id="guild-member-menu"
                className={`user-menu ${isMenuOpen ? 'open' : ''}`}
                role="menu"
                aria-label="Guild member menu"
              >
                <div className="user-menu__header">
                  <div className="avatar avatar--sm member-chip__avatar">{user?.avatar || 'A'}</div>
                  <div className="user-menu__info">
                    <div className="user-menu__name">{user?.username || 'Guild Member'}</div>
                    <div className="user-menu__role">{memberStatus}</div>
                  </div>
                </div>
                <div className="user-menu__divider" />
                <button
                  className="user-menu__link"
                  onClick={() => {
                    window.dispatchEvent(new Event('guild-search-open'));
                    setIsMenuOpen(false);
                  }}
                  type="button"
                  role="menuitem"
                >
                  Search Archives
                </button>
                <Link href={memberRoutes.profile.href} className="user-menu__link" role="menuitem">
                  {memberRoutes.profile.label}
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="user-menu__link user-menu__link--logout"
                  type="button"
                  role="menuitem"
                >
                  {memberRoutes.leave.label}
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="user-bar__tab">{memberRoutes.enter.label}</Link>
          )}
        </div>
      </div>
    </div>
  );
}
