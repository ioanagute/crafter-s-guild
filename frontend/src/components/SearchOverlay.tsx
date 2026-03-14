'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import RouteBadge from '@/components/ui/RouteBadge';
import { primaryRoutes } from '@/lib/navigation';

const searchData = [
  { title: 'Black Flame Candle Techniques', href: '/threads/1', cat: 'Candle Making', tone: 'forum' as const },
  { title: 'Victorian Mourning Embroidery', href: '/threads/2', cat: 'Embroidery', tone: 'forum' as const },
  { title: 'Gothic Cathedral Leather Panel', href: '/threads/3', cat: 'Leatherwork', tone: 'forum' as const },
  { title: 'Browse All Categories', href: '/categories', cat: 'Navigation', tone: 'halls' as const },
  { title: 'All Threads', href: '/threads', cat: 'Navigation', tone: 'forum' as const },
  { title: 'Guild Marketplace', href: '/marketplace', cat: 'Shop', tone: 'bazaar' as const },
  { title: 'Guild Events and Challenges', href: '/events', cat: 'Events', tone: 'events' as const },
  { title: 'My Profile', href: '/profile', cat: 'Account', tone: 'member' as const },
];

const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        event.preventDefault();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('guild-search-open', handleOpen);
    return () => window.removeEventListener('guild-search-open', handleOpen);
  }, []);

  const filteredResults = query.trim()
    ? searchData
        .filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.cat.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 6)
    : [];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="search-overlay open" id="search-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-box" onClick={(event) => event.stopPropagation()}>
        <div className="search-box__header">
          <span className="search-box__icon">
            <RouteBadge tone="forum" label="Search" compact />
          </span>
          <input
            type="text"
            id="search-input"
            placeholder="Seek threads, halls, and guild records..."
            autoComplete="off"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button id="search-close" onClick={() => setIsOpen(false)}>Close</button>
        </div>
        {!query.trim() ? (
          <div className="search-box__suggestions">
            {primaryRoutes.map((route) => (
              <Link key={route.id} href={route.href} className="search-suggestion" onClick={() => setIsOpen(false)}>
                <RouteBadge tone={route.tone} label={route.label} compact />
                <span className="search-suggestion__copy">
                  <span className="search-suggestion__title">{route.label}</span>
                  <span className="search-suggestion__desc">{route.description}</span>
                </span>
              </Link>
            ))}
          </div>
        ) : null}
        <div id="search-results">
          {filteredResults.map((match) => (
            <Link key={match.href} href={match.href} className="search-result-item" onClick={() => setIsOpen(false)}>
              <RouteBadge tone={match.tone} label={match.cat} compact />
              <span className="search-result-cat">{match.cat}</span>
              <span className="search-result-title">{match.title}</span>
            </Link>
          ))}
          {query.trim() && filteredResults.length === 0 && (
            <div className="search-empty">No results found for &quot;<em>{query}</em>&quot;</div>
          )}
        </div>
        <div className="search-box__footer">
          <span><span className="kbd">Enter</span> to open</span>
          <span><span className="kbd">Esc</span> to close</span>
          <span><span className="kbd">/</span> to search anywhere</span>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
