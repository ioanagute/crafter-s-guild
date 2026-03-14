/* ============================================================
   CRAFTER'S GUILD — Web Components (Custom Elements v1)
   Light DOM: all existing CSS rules apply with zero changes.
   Usage:
     <forum-sidebar active="home"></forum-sidebar>
     <forum-search-overlay></forum-search-overlay>
     <forum-scroll-top></forum-scroll-top>
   ============================================================ */

/* ── 1. <forum-sidebar active="pagename"> ────────────────── */
class ForumSidebar extends HTMLElement {
    static get observedAttributes() { return ['active']; }

    connectedCallback() { this._render(); }
    attributeChangedCallback() { this._render(); }

    _render() {
        const active = this.getAttribute('active') || '';

        const links = [
            { id: 'home', href: 'index.html', icon: '🏛️', label: 'Home', section: 'Navigate' },
            { id: 'categories', href: 'categories.html', icon: '📂', label: 'Categories', section: null },
            { id: 'threads', href: 'threads.html', icon: '📜', label: 'Threads', section: null },
            { id: 'marketplace', href: 'marketplace.html', icon: '🏪', label: 'Marketplace', section: 'Discover' },
            { id: 'events', href: 'events.html', icon: '🎭', label: 'Events', section: null },
            { id: 'profile', href: 'profile.html', icon: '👤', label: 'Profile', section: null },
        ];

        let navHTML = '';
        let lastSection = '';
        for (const link of links) {
            if (link.section && link.section !== lastSection) {
                navHTML += `<div class="sidebar__section-label">${link.section}</div>`;
                lastSection = link.section;
            }
            const isActive = link.id === active ? ' sidebar__link--active' : '';
            navHTML += `
        <a href="${link.href}" class="sidebar__link${isActive}">
          <span class="sidebar__link-icon">${link.icon}</span> ${link.label}
        </a>`;
        }

        this.innerHTML = `
      <canvas id="particle-canvas"></canvas>

      <aside class="sidebar" id="sidebar">
        <div class="sidebar__brand">
          <div class="sidebar__logo">
            Crafter's<br>Guild
            <span>Est. MMXXIV</span>
          </div>
        </div>
        <nav class="sidebar__nav">
          <button class="sidebar__search-btn" id="search-btn">
            🔍 Search the Guild <span class="kbd">/</span>
          </button>
          ${navHTML}
        </nav>
        <div class="sidebar__guild-clock" id="guild-clock">00:00:00</div>
        <div class="sidebar__footer">
          <p>⚒️ Forged in darkness</p>
        </div>
      </aside>

      <button class="hamburger" id="hamburger" aria-label="Toggle navigation">☰</button>
    `;

        this._wireMobileNav();
    }

    _wireMobileNav() {
        const hamburger = this.querySelector('#hamburger');
        const sidebar = this.querySelector('#sidebar');
        if (!hamburger || !sidebar) return;

        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            hamburger.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
        });

        document.addEventListener('click', (e) => {
            if (
                window.innerWidth <= 900 &&
                sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                sidebar.classList.remove('open');
                hamburger.textContent = '☰';
            }
        });
    }
}

customElements.define('forum-sidebar', ForumSidebar);


/* ── 2. <forum-search-overlay> ───────────────────────────── */
class ForumSearchOverlay extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <div class="search-overlay" id="search-overlay">
        <div class="search-box">
          <div class="search-box__header">
            <span class="search-box__icon">🔍</span>
            <input type="text" id="search-input"
              placeholder="Search threads, categories, artisans…"
              autocomplete="off">
            <button id="search-close">✕</button>
          </div>
          <div id="search-results"></div>
          <div class="search-box__footer">
            <span><span class="kbd">↵</span> to open</span>
            <span><span class="kbd">Esc</span> to close</span>
            <span><span class="kbd">/</span> to search anywhere</span>
          </div>
        </div>
      </div>
    `;
    }
}

customElements.define('forum-search-overlay', ForumSearchOverlay);


/* ── 3. <forum-scroll-top> ───────────────────────────────── */
class ForumScrollTop extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<button id="scroll-top-btn" title="Back to top">↑</button>`;
    }
}

customElements.define('forum-scroll-top', ForumScrollTop);
