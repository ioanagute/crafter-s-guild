'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SearchOverlay = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    const searchData = [
        { title: 'Black Flame Candle Techniques', href: '/threads/1', cat: '🕯️ Candle Making' },
        { title: 'Victorian Mourning Embroidery', href: '/threads/2', cat: '🧵 Embroidery' },
        { title: 'Gothic Cathedral Leather Panel', href: '/threads/3', cat: '🔨 Leatherwork' },
        { title: 'Browse All Categories', href: '/categories', cat: '📂 Navigation' },
        { title: 'All Threads', href: '/threads', cat: '📜 Navigation' },
        { title: 'Guild Marketplace', href: '/marketplace', cat: '🏪 Shop' },
        { title: 'Guild Events & Challenges', href: '/events', cat: '🎭 Events' },
        { title: 'My Profile', href: '/profile', cat: '👤 Account' },
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filteredResults = query.trim() 
        ? searchData.filter(d => 
            d.title.toLowerCase().includes(query.toLowerCase()) || 
            d.cat.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 6)
        : [];

    if (!isOpen) return null;

    return (
        <div className="search-overlay open" id="search-overlay" onClick={() => setIsOpen(false)}>
            <div className="search-box" onClick={e => e.stopPropagation()}>
                <div className="search-box__header">
                    <span className="search-box__icon">🔍</span>
                    <input 
                        type="text" 
                        id="search-input" 
                        placeholder="Search threads, categories, artisans…" 
                        autoComplete="off"
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button id="search-close" onClick={() => setIsOpen(false)}>✕</button>
                </div>
                <div id="search-results">
                    {filteredResults.map((m, i) => (
                        <Link key={i} href={m.href} className="search-result-item" onClick={() => setIsOpen(false)}>
                            <span className="search-result-cat">{m.cat}</span>
                            <span className="search-result-title">{m.title}</span>
                        </Link>
                    ))}
                    {query.trim() && filteredResults.length === 0 && (
                        <div className="search-empty">No relics found for "<em>{query}</em>"</div>
                    )}
                </div>
                <div className="search-box__footer">
                    <span><span className="kbd">↵</span> to open</span>
                    <span><span className="kbd">Esc</span> to close</span>
                    <span><span className="kbd">/</span> to search anywhere</span>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
