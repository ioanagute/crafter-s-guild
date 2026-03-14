/* ============================================================
   CRAFTER'S GUILD — Platform 2026 JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Animated Stat Counters ──
    function animateCounter(el) {
        const target = parseInt(el.dataset.count.replace(/,/g, ''), 10);
        const duration = 1800;
        const start = performance.now();
        const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(ease(progress) * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counterEls = document.querySelectorAll('[data-count]');
    if (counterEls.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterEls.forEach(el => counterObserver.observe(el));
    }

    // ── Live Guild Clock ──
    const clockEl = document.getElementById('guild-clock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            const s = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${h}:${m}:${s}`;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // ── Search Overlay ──
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    const searchData = [
        { title: 'Black Flame Candle Techniques', href: 'thread.html', cat: '🕯️ Candle Making' },
        { title: 'Victorian Mourning Embroidery', href: 'thread.html', cat: '🧵 Embroidery' },
        { title: 'Gothic Cathedral Leather Panel', href: 'thread.html', cat: '🔨 Leatherwork' },
        { title: 'Damascus Steel Letter Opener', href: 'thread.html', cat: '⚒️ Blacksmithing' },
        { title: 'Skull Motif Cable Knit Scarf', href: 'thread.html', cat: '🧶 Knitting' },
        { title: 'Raven Feather Quill Pen Tutorial', href: 'thread.html', cat: '🪶 Quillwork' },
        { title: 'Monthly Craft Challenge: Gothic Valentines', href: 'thread.html', cat: '📌 Pinned' },
        { title: 'Browse All Categories', href: 'categories.html', cat: '📂 Navigation' },
        { title: 'All Threads', href: 'threads.html', cat: '📜 Navigation' },
        { title: 'Guild Marketplace', href: 'marketplace.html', cat: '🏪 Shop' },
        { title: 'Guild Events & Challenges', href: 'events.html', cat: '🎭 Events' },
        { title: 'My Profile', href: 'profile.html', cat: '👤 Account' },
    ];

    function renderResults(query) {
        const resultsEl = document.getElementById('search-results');
        if (!resultsEl) return;
        if (!query.trim()) { resultsEl.innerHTML = ''; return; }
        const matches = searchData.filter(d =>
            d.title.toLowerCase().includes(query.toLowerCase()) ||
            d.cat.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
        if (matches.length === 0) {
            resultsEl.innerHTML = `<div class="search-empty">No relics found for "<em>${query}</em>"</div>`;
            return;
        }
        resultsEl.innerHTML = matches.map(m => `
      <a href="${m.href}" class="search-result-item">
        <span class="search-result-cat">${m.cat}</span>
        <span class="search-result-title">${m.title}</span>
      </a>
    `).join('');
    }

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('open');
            setTimeout(() => searchInput && searchInput.focus(), 100);
        });
        searchClose && searchClose.addEventListener('click', () => searchOverlay.classList.remove('open'));
        searchOverlay.addEventListener('click', e => {
            if (e.target === searchOverlay) searchOverlay.classList.remove('open');
        });
        searchInput && searchInput.addEventListener('input', () => renderResults(searchInput.value));
    }

    // ── Keyboard Shortcuts ──
    document.addEventListener('keydown', e => {
        // / to focus search
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            if (searchOverlay) { searchOverlay.classList.add('open'); setTimeout(() => searchInput && searchInput.focus(), 100); }
        }
        // Escape closes search
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) {
            searchOverlay.classList.remove('open');
        }
    });

    // ── Notification Bell ──
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', e => {
            e.stopPropagation();
            notifDropdown.classList.toggle('open');
            notifBtn.querySelector('.notif-badge') && notifBtn.querySelector('.notif-badge').remove();
        });
        document.addEventListener('click', () => notifDropdown.classList.remove('open'));
        notifDropdown.addEventListener('click', e => e.stopPropagation());
    }

    // ── Particle Canvas Background ──
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles;
        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        function createParticle() {
            return {
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.5 + 0.3,
                dx: (Math.random() - 0.5) * 0.25,
                dy: -Math.random() * 0.4 - 0.1,
                alpha: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.6 ? '#c9a44a' : Math.random() > 0.5 ? '#6b3a7d' : '#8b2a3a'
            };
        }
        particles = Array.from({ length: 80 }, createParticle);

        function drawParticles() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(p => {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                p.x += p.dx; p.y += p.dy;
                if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
                if (p.x < -4 || p.x > W + 4) p.dx *= -1;
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ── Sidebar Active Link (enhanced) ──
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar__link').forEach(link => {
        link.classList.remove('sidebar__link--active');
        if (link.getAttribute('href') === currentPage) link.classList.add('sidebar__link--active');
    });

    // ── Scroll-to-top button ──
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── Trending tags interaction ──
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function () {
            this.style.transform = 'scale(1.15)';
            setTimeout(() => this.style.transform = '', 280);
        });
    });

});
