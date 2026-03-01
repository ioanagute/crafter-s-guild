/* ============================================================
   THE OBSIDIAN LOOM — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Sidebar Toggle ──
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
        hamburger.textContent = '☰';
      }
    });
  }

  // ── Scroll-Triggered Animations ──
  const observeElements = document.querySelectorAll('.observe-animate');

  if (observeElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    observeElements.forEach(el => observer.observe(el));
  }

  // ── Like Button Interactions ──
  const likeButtons = document.querySelectorAll('.btn--like');

  likeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const countEl = btn.querySelector('.like-count');
      let count = parseInt(countEl.textContent);

      if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        count--;
      } else {
        btn.classList.add('liked');
        count++;

        // Micro-animation: scale pop
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
        }, 200);
      }

      countEl.textContent = count;
    });
  });


  // ── Reply Box Enhancement ──
  const replyTextarea = document.getElementById('replyTextarea');
  const postReplyBtn = document.getElementById('postReplyBtn');

  if (replyTextarea && postReplyBtn) {
    // Auto-resize textarea
    replyTextarea.addEventListener('input', () => {
      replyTextarea.style.height = 'auto';
      replyTextarea.style.height = replyTextarea.scrollHeight + 'px';
    });

    // Glow on focus
    replyTextarea.addEventListener('focus', () => {
      replyTextarea.closest('.reply-box').style.boxShadow = 'var(--glow-gold)';
    });
    replyTextarea.addEventListener('blur', () => {
      replyTextarea.closest('.reply-box').style.boxShadow = 'none';
    });

    // Post reply interaction
    postReplyBtn.addEventListener('click', () => {
      const text = replyTextarea.value.trim();
      if (text.length === 0) {
        replyTextarea.style.borderColor = 'var(--accent-red-bright)';
        replyTextarea.style.boxShadow = 'var(--glow-red)';
        setTimeout(() => {
          replyTextarea.style.borderColor = 'var(--border-subtle)';
          replyTextarea.style.boxShadow = 'none';
        }, 1500);
        return;
      }

      // Success animation
      postReplyBtn.textContent = '✓ Posted!';
      postReplyBtn.style.background = 'linear-gradient(135deg, #2a6b3a, #3a8b4a)';
      postReplyBtn.style.borderColor = '#3a8b4a';
      replyTextarea.value = '';
      replyTextarea.style.height = 'auto';

      setTimeout(() => {
        postReplyBtn.textContent = '⚜️ Post Reply';
        postReplyBtn.style.background = '';
        postReplyBtn.style.borderColor = '';
      }, 2000);
    });
  }

  // ── New Thread Button ──
  const newThreadBtn = document.getElementById('newThreadBtn');
  if (newThreadBtn) {
    newThreadBtn.addEventListener('click', () => {
      newThreadBtn.textContent = '✦ Coming Soon...';
      newThreadBtn.style.opacity = '0.7';
      setTimeout(() => {
        newThreadBtn.textContent = '✦ New Thread';
        newThreadBtn.style.opacity = '1';
      }, 1500);
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Console Easter Egg ──
  console.log(
    '%c⚜️ The Obsidian Loom ⚜️',
    'color: #c9a44a; font-size: 20px; font-family: serif; text-shadow: 0 0 10px rgba(201,164,74,0.5);'
  );
  console.log(
    '%cWhere shadow meets craft.',
    'color: #9e97a3; font-size: 12px; font-family: serif;'
  );

  // ── Authentication UI Management ──
  function initAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sidebarNav = document.querySelector('.sidebar__nav');
    if (!sidebarNav) return;

    // 1. Remove "Sign In" from sidebar menu for everyone
    const signInLinks = Array.from(sidebarNav.querySelectorAll('.sidebar__link')).filter(link =>
      link.getAttribute('href') === 'auth.html' || link.textContent.includes('Sign In')
    );
    signInLinks.forEach(link => link.remove());

    // 2. Manage Top-Right Logout/Sign-In Actions
    const mainContent = document.querySelector('.main__content');
    if (!mainContent) return;

    // Create container if it doesn't exist
    let topActions = document.querySelector('.top-actions');
    if (!topActions) {
      topActions = document.createElement('div');
      topActions.className = 'top-actions';

      // Ensure main content is relative if we want to absolute position it
      if (mainContent) mainContent.style.position = 'relative';

      mainContent.prepend(topActions);
    }

    if (isLoggedIn) {
      const username = localStorage.getItem('username') || localStorage.getItem('userEmail')?.split('@')[0] || 'Artisan';
      const avatar = localStorage.getItem('userAvatar') || '🦇';

      topActions.innerHTML = `
        <div class="user-meta" id="userSigil">
          <div class="user-meta__sigil">${avatar}</div>
          <div class="user-menu" id="userDropdown">
            <div class="user-menu__header">
              <div class="avatar avatar--md">${avatar}</div>
              <div class="user-menu__info">
                <div class="user-menu__name">${username}</div>
                <div class="user-menu__role">Master Artisan</div>
              </div>
            </div>
            <div class="user-menu__divider"></div>
            <a href="profile.html" class="user-menu__link">👤 My Profile</a>
            <button class="user-menu__link">⚙️ Settings</button>
            <a href="marketplace.html" class="user-menu__link">🏪 My Listings</a>
            <div class="user-menu__divider"></div>
            <button id="logoutBtn" class="user-menu__link user-menu__link--logout">🗝️ Logout</button>
          </div>
        </div>
      `;

      const sigil = document.getElementById('userSigil');
      const dropdown = document.getElementById('userDropdown');

      sigil.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!sigil.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });

      document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');
        window.location.reload();
      });

      // Settings dummy interaction
      document.querySelector('.user-menu__link:nth-of-type(2)')?.addEventListener('click', () => {
        alert('Settings module is currently being forged in the deeper halls...');
      });
    } else {
      // Don't show Sign In button if we're already on the auth page
      if (window.location.pathname.includes('auth.html')) {
        topActions.innerHTML = '';
        return;
      }

      topActions.innerHTML = `
        <a href="auth.html" class="btn btn--primary">
          <span class="sidebar__link-icon">🗝️</span> Sign In
        </a>
      `;
    }
  }

  initAuthUI();
});
