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

    // 2. Manage Top-Bar Logout/Sign-In Actions
    const layout = document.querySelector('.layout');
    if (!layout) return;

    // Create user bar if it doesn't exist
    let userBar = document.querySelector('.user-bar');
    if (!userBar) {
      userBar = document.createElement('div');
      userBar.className = 'user-bar';
      layout.prepend(userBar);
    }

    if (isLoggedIn) {
      const username = localStorage.getItem('username') || localStorage.getItem('userEmail')?.split('@')[0] || 'Artisan';
      const avatar = localStorage.getItem('userAvatar') || '🦇';

      userBar.innerHTML = `
        <div class="user-bar__content">
          <div class="user-bar__tabs">
            <a href="profile.html" class="user-bar__tab">👤 Profile</a>
            <button class="user-bar__tab" id="settingsTab">⚙️ Settings</button>
            <a href="marketplace.html" class="user-bar__tab">🏪 Listings</a>
            <button id="logoutBtn" class="user-bar__tab user-bar__tab--logout">🗝️ Logout</button>
          </div>
          <div class="user-bar__user">
            <span class="user-bar__username">${username}</span>
            <div class="avatar avatar--sm">${avatar}</div>
          </div>
        </div>
      `;

      document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');
        window.location.reload();
      });

      document.getElementById('settingsTab')?.addEventListener('click', () => {
        alert('Settings module is currently being forged in the deeper halls...');
      });
    } else {
      // Don't show Sign In button if we're already on the auth page
      if (!window.location.pathname.includes('auth.html')) {
        userBar.innerHTML = `
          <div class="user-bar__content">
            <a href="auth.html" class="btn btn--primary">
              <span class="sidebar__link-icon">🗝️</span> Sign In
            </a>
          </div>
        `;
      } else {
        userBar.style.display = 'none';
      }
    }

    // ── User Bar Scroll Logic ──
    let lastScroll = 0;
    const hideThreshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        userBar.classList.remove('user-bar--hidden');
        return;
      }

      if (Math.abs(currentScroll - lastScroll) < 10) return;

      if (currentScroll > lastScroll && currentScroll > hideThreshold) {
        userBar.classList.add('user-bar--hidden');
      } else {
        userBar.classList.remove('user-bar--hidden');
      }

      lastScroll = currentScroll;
    });
  }

  initAuthUI();

  // ── Profile Tabs Logic ──
  const profileTabs = document.querySelectorAll('.profile-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  if (profileTabs.length > 0 && tabContents.length > 0) {
    profileTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        profileTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  // ── Gallery Modal & Media Processing ──
  const galleryItems = document.querySelectorAll('.gallery-item');
  const galleryModal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('modalImg');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCounters = document.getElementById('modalCounters');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const modalClose = document.querySelector('.modal-close');

  let currentMediaList = [];
  let currentMediaIndex = 0;

  if (galleryItems.length > 0 && galleryModal) {

    // Helper: Update modal content based on current index
    const updateModalContent = () => {
      const isVideo = modalVideo.getAttribute('data-active-video') === 'true';

      if (isVideo) {
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = currentMediaList[0];
        modalVideo.play();
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        modalCounters.textContent = '1 / 1';
      } else {
        modalVideo.style.display = 'none';
        modalVideo.pause();
        modalImg.style.display = 'block';
        modalImg.src = currentMediaList[currentMediaIndex];

        if (currentMediaList.length > 1) {
          prevBtn.style.display = 'flex';
          nextBtn.style.display = 'flex';
          modalCounters.textContent = `${currentMediaIndex + 1} / ${currentMediaList.length}`;
        } else {
          prevBtn.style.display = 'none';
          nextBtn.style.display = 'none';
          modalCounters.textContent = '1 / 1';
        }
      }
    };

    // Open Modal
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const title = item.getAttribute('data-title') || '';
        const desc = item.getAttribute('data-desc') || '';

        modalTitle.textContent = title;
        modalDesc.textContent = desc;

        if (type === 'video') {
          currentMediaList = [item.getAttribute('data-video')];
          modalVideo.setAttribute('data-active-video', 'true');
        } else {
          currentMediaList = JSON.parse(item.getAttribute('data-images') || '[]');
          modalVideo.setAttribute('data-active-video', 'false');
        }

        currentMediaIndex = 0;
        updateModalContent();
        galleryModal.classList.add('gallery-modal--active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    });

    // Close Modal helper
    const closeModal = () => {
      galleryModal.classList.remove('gallery-modal--active');
      modalVideo.pause();
      modalVideo.src = ''; // Clear source to fully stop buffering
      document.body.style.overflow = 'auto'; // Restore scroll
    };

    // Close events
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    // Clicking outside content area
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal || e.target.classList.contains('modal-media-container')) {
        closeModal();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && galleryModal.classList.contains('gallery-modal--active')) {
        closeModal();
      }
    });

    // Navigation events
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentMediaList.length > 1) {
          currentMediaIndex = (currentMediaIndex - 1 + currentMediaList.length) % currentMediaList.length;
          updateModalContent();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentMediaList.length > 1) {
          currentMediaIndex = (currentMediaIndex + 1) % currentMediaList.length;
          updateModalContent();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (galleryModal.classList.contains('gallery-modal--active') && currentMediaList.length > 1) {
        if (e.key === 'ArrowLeft') {
          currentMediaIndex = (currentMediaIndex - 1 + currentMediaList.length) % currentMediaList.length;
          updateModalContent();
        } else if (e.key === 'ArrowRight') {
          currentMediaIndex = (currentMediaIndex + 1) % currentMediaList.length;
          updateModalContent();
        }
      }
    });

  }
});
