/* ============================================================
   THE OBSIDIAN LOOM — Authentication Page JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── View references ──
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const viewLogin = document.getElementById('view-login');
    const viewRegister = document.getElementById('view-register');
    const toast = document.getElementById('auth-toast');

    if (!tabLogin) return; // not on auth page

    // ── Tab Switching ──
    function showView(mode) {
        const isLogin = mode === 'login';

        tabLogin.classList.toggle('active', isLogin);
        tabRegister.classList.toggle('active', !isLogin);
        tabLogin.setAttribute('aria-selected', isLogin);
        tabRegister.setAttribute('aria-selected', !isLogin);

        viewLogin.classList.toggle('hidden', !isLogin);
        viewRegister.classList.toggle('hidden', isLogin);
    }

    tabLogin.addEventListener('click', () => showView('login'));
    tabRegister.addEventListener('click', () => showView('register'));

    document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showView('register');
        viewRegister.querySelector('#reg-username').focus();
    });

    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showView('login');
        viewLogin.querySelector('#login-email').focus();
    });

    // ── Password Visibility Toggles ──
    document.querySelectorAll('.pwd-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            if (!input) return;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.textContent = isPassword ? '🙈' : '👁';
        });
    });

    // ── Guild Role Picker ──
    const roleCards = document.querySelectorAll('.role-card');
    const roleInput = document.getElementById('reg-role');
    const roleUpgradeNote = document.getElementById('role-upgrade-note');

    function selectRole(card) {
        roleCards.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
        const role = card.dataset.role;
        if (roleInput) roleInput.value = role;
        if (roleUpgradeNote) roleUpgradeNote.classList.toggle('hidden', role !== 'wanderer');
    }

    roleCards.forEach(card => {
        card.addEventListener('click', () => selectRole(card));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRole(card); }
            // Arrow key navigation between cards
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const all = [...roleCards];
                const idx = all.indexOf(card);
                const next = all[(idx + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length];
                selectRole(next);
                next.focus();
            }
        });
    });

    // ── Avatar Picker ──
    const avatarOptions = document.querySelectorAll('.avatar-option');
    let selectedAvatar = '🦇';

    avatarOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            avatarOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedAvatar = opt.dataset.avatar;

            // Bounce effect
            opt.style.transform = 'scale(1.25)';
            setTimeout(() => { opt.style.transform = ''; }, 220);
        });

        // Keyboard support
        opt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                opt.click();
            }
        });
    });

    // ── Password Strength Meter ──
    const regPassword = document.getElementById('reg-password');
    const strengthMeter = document.getElementById('strength-meter');
    const strengthFill = document.getElementById('strength-fill');
    const strengthLabel = document.getElementById('strength-label');

    const strengthLevels = [
        { label: 'Cursed — Too Weak', color: '#c94058', width: '20%' },
        { label: 'Apprentice', color: '#e07a30', width: '40%' },
        { label: 'Journeyman', color: '#c9a44a', width: '60%' },
        { label: 'Artisan', color: '#7ab06c', width: '80%' },
        { label: '⚜️ Master Craftsman', color: '#5aadad', width: '100%' },
    ];

    function measureStrength(pwd) {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.length >= 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return Math.max(0, Math.min(score, 4));
    }

    if (regPassword) {
        regPassword.addEventListener('input', () => {
            const pwd = regPassword.value;
            if (pwd.length === 0) {
                strengthMeter.classList.remove('visible');
                return;
            }
            strengthMeter.classList.add('visible');
            const idx = measureStrength(pwd);
            const level = strengthLevels[idx];
            strengthFill.style.width = level.width;
            strengthFill.style.background = level.color;
            strengthLabel.textContent = level.label;
            strengthLabel.style.color = level.color;
        });
    }

    // ── Form Validation Utilities ──
    function showError(id, show = true) {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('visible', show);
    }

    function markInputError(id, hasError) {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('error', hasError);
    }

    function clearAllErrors(formEl) {
        formEl.querySelectorAll('.form-error').forEach(e => e.classList.remove('visible'));
        formEl.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ── Toast Notification ──
    let toastTimer;

    function showToast(message, type = 'success') {
        const icon = document.getElementById('toast-icon');
        const msg = document.getElementById('toast-message');

        icon.textContent = type === 'success' ? '✦' : '✕';
        msg.textContent = message;
        toast.className = `auth-toast auth-toast--${type}`;

        clearTimeout(toastTimer);
        // Force reflow to restart animation
        void toast.offsetWidth;
        toast.classList.add('show');

        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // ── Simulate loading state ──
    function setButtonLoading(btn, loading) {
        btn.classList.toggle('loading', loading);
        btn.disabled = loading;
    }

    // ── LOGIN FORM ──
    const loginForm = document.getElementById('login-form');
    const loginSubmit = document.getElementById('login-submit');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors(loginForm);

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        let valid = true;

        if (!email) {
            showError('login-email-error');
            markInputError('login-email', true);
            valid = false;
        }

        if (!password) {
            showError('login-password-error');
            markInputError('login-password', true);
            valid = false;
        }

        if (!valid) return;

        // Simulate async login
        setButtonLoading(loginSubmit, true);

        await new Promise(r => setTimeout(r, 1400));

        setButtonLoading(loginSubmit, false);

        // Demo: always "succeed" — in real app connect to backend
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        showToast(`Welcome back to the Loom, ${email.split('@')[0] || email}! ⚜️`, 'success');

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2200);
    });

    // Live validation — clear error on input
    document.getElementById('login-email').addEventListener('input', () => {
        markInputError('login-email', false);
        showError('login-email-error', false);
    });
    document.getElementById('login-password').addEventListener('input', () => {
        markInputError('login-password', false);
        showError('login-password-error', false);
    });

    // Forgot password
    document.getElementById('forgot-link').addEventListener('click', (e) => {
        e.preventDefault();
        showToast('A password reset raven has been dispatched to your email. 🦅', 'success');
    });

    // Social buttons
    document.getElementById('btn-google-login').addEventListener('click', () => {
        showToast('Google sign-in coming soon to the Loom! 🔮', 'success');
    });
    document.getElementById('btn-discord-login').addEventListener('click', () => {
        showToast('Discord sign-in coming soon to the Loom! 🔮', 'success');
    });

    // ── REGISTER FORM ──
    const registerForm = document.getElementById('register-form');
    const registerSubmit = document.getElementById('register-submit');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors(registerForm);

        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const terms = document.getElementById('reg-terms').checked;
        let valid = true;

        if (!username || username.length < 3) {
            showError('reg-username-error');
            markInputError('reg-username', true);
            valid = false;
        }

        if (!email || !isValidEmail(email)) {
            showError('reg-email-error');
            markInputError('reg-email', true);
            valid = false;
        }

        if (!password || password.length < 8) {
            showError('reg-password-error');
            markInputError('reg-password', true);
            valid = false;
        }

        if (!confirm || confirm !== password) {
            showError('reg-confirm-error');
            markInputError('reg-confirm', true);
            valid = false;
        }

        if (!terms) {
            showError('reg-terms-error');
            valid = false;
        }

        if (!valid) return;

        // Simulate async registration
        setButtonLoading(registerSubmit, true);

        await new Promise(r => setTimeout(r, 1800));

        setButtonLoading(registerSubmit, false);

        const role = (roleInput ? roleInput.value : null) || 'creator';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userAvatar', selectedAvatar);
        localStorage.setItem('userRole', role);

        const roleLabel = role === 'wanderer' ? 'Shadow Wanderer' : 'Artisan Creator';
        showToast(`Welcome, ${username} ${selectedAvatar}! You join as ${roleLabel}. ⛜️`, 'success');

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2500);
    });

    // Live validation for register fields
    ['reg-username', 'reg-email', 'reg-password', 'reg-confirm'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            markInputError(id, false);
            showError(`${id}-error`, false);
        });
    });

    document.getElementById('reg-terms').addEventListener('change', () => {
        showError('reg-terms-error', false);
    });

    // ── Keyboard trap: Enter on login goes to password ──
    document.getElementById('login-email').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('login-password').focus();
        }
    });

    // ── Easter egg: Konami code on auth page ──
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIdx = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === KONAMI[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === KONAMI.length) {
                konamiIdx = 0;
                showToast('🦇 You have awakened the ancient spirits of the Loom... +100 Mystique', 'success');
            }
        } else {
            konamiIdx = 0;
        }
    });

});
