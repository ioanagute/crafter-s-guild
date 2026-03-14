'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
    const pathname = usePathname();
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

    const links = [
        { id: 'home', href: '/', icon: '🏛️', label: 'Home', section: 'Navigate' },
        { id: 'categories', href: '/categories', icon: '📂', label: 'Categories', section: null },
        { id: 'threads', href: '/threads', icon: '📜', label: 'Threads', section: null },
        { id: 'marketplace', href: '/marketplace', icon: '🏪', label: 'Marketplace', section: 'Discover' },
        { id: 'events', href: '/events', icon: '🎭', label: 'Events', section: null },
        { id: 'profile', href: '/profile', icon: '👤', label: 'Profile', section: null },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar__brand">
                    <div className="sidebar__logo">
                        Crafter's<br />Guild
                        <span>Est. MMXXIV</span>
                    </div>
                </div>
                <nav className="sidebar__nav">
                    <button className="sidebar__search-btn" id="search-btn">
                        🔍 Search the Guild <span className="kbd">/</span>
                    </button>
                    {links.reduce((acc: React.ReactNode[], link, idx) => {
                        if (link.section) {
                            acc.push(<div key={`section-${idx}`} className="sidebar__section-label">{link.section}</div>);
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
                            </Link>
                        );
                        return acc;
                    }, [])}
                </nav>
                <div className="sidebar__guild-clock" id="guild-clock">{clock}</div>
                <div className="sidebar__footer">
                    <p>⚒️ Forged in darkness</p>
                </div>
            </aside>

            <button
                className="hamburger"
                id="hamburger"
                aria-label="Toggle navigation"
                onClick={toggleSidebar}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Back-drop for mobile */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99,
                        background: 'rgba(0,0,0,0.5)'
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;
