/* ===== Login Page with Sign Up, Password Recovery & Remember Me ===== */
async function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <span class="login-logo-icon">🛒</span>
          <h1><span class="login-logo-green">Fresh</span>Cart</h1>
          <p id="header-subtitle">Sign in to continue shopping</p>
        </div>
        
        <!-- Main Tab Switcher: Sign In vs Sign Up -->
        <div class="auth-tabs-main">
          <button class="auth-tab-main active" data-mode="signin" id="tab-signin">
            Sign In
          </button>
          <button class="auth-tab-main" data-mode="signup" id="tab-signup">
            Create Account
          </button>
        </div>

        <!-- Sign In Mode -->
        <div class="auth-mode active" id="signin-mode">
          <div class="login-tabs">
            <button class="login-tab active" data-role="user" id="tab-user">
              <span class="login-tab-icon">👤</span> Customer
            </button>
            <button class="login-tab" data-role="admin" id="tab-admin">
              <span class="login-tab-icon">👨‍💼</span> Admin
            </button>
          </div>

          <form class="login-form" id="login-form">
            <div class="form-group">
              <label for="login-phone">Mobile Number</label>
              <input type="tel" id="login-phone" placeholder="Enter your 10-digit mobile number" required autocomplete="tel" />
              <span class="field-error hidden" id="login-phone-error"></span>
            </div>

            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="login-password" placeholder="Enter your password" required autocomplete="current-password" />
                <button type="button" class="toggle-pass" id="toggle-pass">👁</button>
              </div>
              <span class="field-error hidden" id="login-password-error"></span>
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="remember-me" />
              <label for="remember-me">Remember me for 30 days</label>
            </div>

            <div class="login-error hidden" id="login-error"></div>

            <button type="submit" class="login-btn" id="login-btn">
              <span>Sign In</span>
            </button>
          </form>

          <div class="auth-links">
            <button type="button" class="link-btn" id="forgot-pass-btn">Forgot password?</button>
          </div>

          <!-- Social Login -->
          <div class="social-divider">or continue with</div>
          <div class="social-login">
            <button type="button" class="social-btn" title="Google">
              <span>🔵</span> Google
            </button>
            <button type="button" class="social-btn" title="GitHub">
              <span>⚫</span> GitHub
            </button>
            <button type="button" class="social-btn" title="Apple">
              <span>🍎</span> Apple
            </button>
          </div>

        </div>

        <!-- Sign Up Mode -->
        <div class="auth-mode" id="signup-mode">
          <form class="signup-form" id="signup-form">
            <div class="form-group">
              <label for="signup-name">Full Name</label>
              <input type="text" id="signup-name" placeholder="Enter your full name" required />
              <span class="field-error hidden" id="signup-name-error"></span>
            </div>

            <div class="form-group">
              <label for="signup-phone">Mobile Number</label>
              <input type="tel" id="signup-phone" placeholder="Enter your 10-digit mobile number" required autocomplete="tel" />
              <span class="field-error hidden" id="signup-phone-error"></span>
            </div>

            <div class="form-group">
              <label for="signup-password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="signup-password" placeholder="Min 8 characters" required />
                <button type="button" class="toggle-pass" id="toggle-signup-pass">👁</button>
              </div>
              <div class="password-strength" id="password-strength">
                <div class="strength-bar"></div>
              </div>
              <span class="field-error hidden" id="signup-password-error"></span>
            </div>

            <div class="form-group">
              <label for="signup-confirm-password">Confirm Password</label>
              <div class="password-wrapper">
                <input type="password" id="signup-confirm-password" placeholder="Re-enter your password" required />
                <button type="button" class="toggle-pass" id="toggle-signup-confirm-pass">👁</button>
              </div>
              <span class="field-error hidden" id="signup-confirm-password-error"></span>
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="signup-terms" required />
              <label for="signup-terms">I agree to the Terms & Conditions</label>
            </div>

            <div class="login-error hidden" id="signup-error"></div>

            <button type="submit" class="login-btn" id="signup-btn">
              <span>Create Account</span>
            </button>
          </form>
        </div>

        <!-- Forgot Password Modal -->
        <div class="modal hidden" id="forgot-modal">
          <div class="modal-overlay" id="modal-overlay"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h3>Reset Password</h3>
              <button type="button" class="modal-close" id="modal-close">✕</button>
            </div>
            <form class="forgot-form" id="forgot-form">
              <p class="modal-text">Enter your mobile number and we'll send you an SMS with a link to reset your password.</p>
              <div class="form-group">
                <label for="forgot-phone">Mobile Number</label>
                <input type="tel" id="forgot-phone" placeholder="Enter your 10-digit number" required />
                <span class="field-error hidden" id="forgot-phone-error"></span>
              </div>
              <div class="login-error hidden" id="forgot-error"></div>
              <button type="submit" class="login-btn" id="forgot-btn">
                Send Reset Link
              </button>
              <p class="modal-text" style="margin-top: 16px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                Check your email for reset instructions (demo: no real email sent)
              </p>
            </form>
          </div>
        </div>
      </div>
      <div class="login-bg-decor">
        <div class="decor-circle c1"></div>
        <div class="decor-circle c2"></div>
        <div class="decor-circle c3"></div>
      </div>
    </div>
  `;

  let activeRole = 'user';
  let authMode = 'signin';

  // ===== Main Tab Switching: Sign In vs Sign Up =====
  document.querySelectorAll('.auth-tab-main').forEach((tab) => {
    tab.addEventListener('click', () => {
      const newMode = tab.dataset.mode;
      if (newMode === authMode) return;
      
      document.querySelectorAll('.auth-tab-main').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.auth-mode').forEach((m) => m.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${newMode}-mode`).classList.add('active');
      authMode = newMode;
    });
  });

  // ===== Role Tabs (Customer/Admin) =====
  document.querySelectorAll('.login-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.login-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeRole = tab.dataset.role;
    });
  });

  // ===== Password Toggle =====
  const togglePasswordInput = (inputId) => {
    const input = document.getElementById(inputId);
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
  };

  document.getElementById('toggle-pass').addEventListener('click', () => togglePasswordInput('login-password'));
  document.getElementById('toggle-signup-pass').addEventListener('click', () => togglePasswordInput('signup-password'));
  document.getElementById('toggle-signup-confirm-pass').addEventListener('click', () => togglePasswordInput('signup-confirm-password'));

  // ===== Real-time Password Strength Indicator =====
  document.getElementById('signup-password').addEventListener('input', (e) => {
    const pass = e.target.value;
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[@$!%*?&]/.test(pass)) strength++;
    
    const bar = document.querySelector('.strength-bar');
    bar.style.width = (strength * 25) + '%';
    bar.style.background = strength <= 1 ? '#ef4444' : strength === 2 ? '#eab308' : strength === 3 ? '#f97316' : '#22c55e';
  });

  // ===== Form Validation =====
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const showFieldError = (fieldId, message) => {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  };

  const clearFieldError = (fieldId) => {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) errorEl.classList.add('hidden');
  };

  // ===== Sign In Form =====
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const errEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    clearFieldError('login-phone');
    clearFieldError('login-password');
    errEl.classList.add('hidden');

    // Validation
    let isValid = true;
    if (!phone || phone.length < 10) {
      showFieldError('login-phone', 'Valid mobile number is required');
      isValid = false;
    }

    if (!password) {
      showFieldError('login-password', 'Password is required');
      isValid = false;
    }

    if (!isValid) return;

    btn.disabled = true;
    btn.innerHTML = '<span>Signing in...</span>';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, rememberMe }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        errEl.textContent = data.error || 'Invalid credentials';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span>';
        return;
      }

      

      if (data.user.role !== activeRole) {
        errEl.textContent = `This account is not a ${activeRole} account`;
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span>';
        return;
      }

      Auth.setUser(data.user, rememberMe);
      Toast.show(`Welcome back, ${data.user.name}!`);
      window.location.hash = data.user.role === 'admin' ? '#/admin' : '#/';
    } catch {
      errEl.textContent = 'Network error. Please try again.';
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span>Sign In</span>';
    }
  });

  // ===== Sign Up Form =====
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errEl = document.getElementById('signup-error');
    const btn = document.getElementById('signup-btn');

    clearFieldError('signup-name');
    clearFieldError('signup-phone');
    clearFieldError('signup-password');
    clearFieldError('signup-confirm-password');
    errEl.classList.add('hidden');

    // Validation
    let isValid = true;
    if (!name || name.length < 2) {
      showFieldError('signup-name', 'Name must be at least 2 characters');
      isValid = false;
    }

    if (!phone || phone.length < 10) {
      showFieldError('signup-phone', 'Valid mobile number is required');
      isValid = false;
    }

    if (!password) {
      showFieldError('signup-password', 'Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      showFieldError('signup-password', 'Password must be at least 8 characters');
      isValid = false;
    }

    if (password !== confirmPassword) {
      showFieldError('signup-confirm-password', 'Passwords do not match');
      isValid = false;
    }

    if (!isValid) return;

    btn.disabled = true;
    btn.innerHTML = '<span>Creating account...</span>';

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, role: 'user' }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        errEl.textContent = data.error || 'Signup failed';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span>Create Account</span>';
        return;
      }

      Toast.show('Account created! Signing you in...');
      Auth.setUser(data.user, false);
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1000);
    } catch {
      errEl.textContent = 'Network error. Please try again.';
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span>Create Account</span>';
    }
  });



  // ===== Forgot Password Modal =====
  const modal = document.getElementById('forgot-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const forgotBtn = document.getElementById('forgot-pass-btn');

  forgotBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.getElementById('forgot-form').reset();
    clearFieldError('forgot-phone');
    document.getElementById('forgot-error').classList.add('hidden');
  };

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('forgot-phone').value.trim();
    const errEl = document.getElementById('forgot-error');
    const btn = document.getElementById('forgot-btn');

    clearFieldError('forgot-phone');
    errEl.classList.add('hidden');

    if (!phone || phone.length < 10) {
      showFieldError('forgot-phone', 'Valid mobile number is required');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        errEl.textContent = data.error || 'Failed to send reset link';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = '<span>Send Reset Link</span>';
        return;
      }

      Toast.show('Reset link sent! Check your SMS.');
      setTimeout(closeModal, 1500);
    } catch {
      errEl.textContent = 'Network error. Please try again.';
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span>Send Reset Link</span>';
    }
  });

  // ===== Social Login (Demo - shows message) =====
  document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      Toast.show('Social login coming soon! 🚀');
    });
  });
}
