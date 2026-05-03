/* ===== User Profile Page ===== */
async function renderProfilePage() {
  const app = document.getElementById('app');
  const user = Auth.getUser();

  if (!user) {
    window.location.hash = '#/login';
    return;
  }

  // Load saved address if exists (mocking using localStorage)
  const savedAddress = localStorage.getItem('guru_address') || '123 Guru Enclave, Tech City, 400001';
  const guruPoints = localStorage.getItem('guru_points') || Math.floor(Math.random() * 500 + 100);

  app.innerHTML = renderHeader() + `
    <div style="max-width: 800px; margin: 0 auto; padding: 48px 24px; min-height: 70vh;">
      <h1 style="font-family: var(--font-heading); margin-bottom: 32px; color: var(--text-primary); display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 2.5rem; background: var(--bg-glass); border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--accent);">${user.avatar}</span>
        Account Settings
      </h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        
        <!-- Personal Details -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 32px;">
          <h2 style="font-family: var(--font-heading); margin-bottom: 24px; color: var(--accent); font-size: 1.2rem;">Personal Information</h2>
          <form id="profile-form" class="modal-form">
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Full Name</label>
              <input type="text" id="profile-name" value="${user.name}" required style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); color: var(--text-primary);" />
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Mobile Number / ID</label>
              <input type="text" value="${user.phone || user.email || 'N/A'}" disabled style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.4); color: var(--text-muted); cursor: not-allowed;" />
            </div>
            <div class="form-group" style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Default Delivery Address</label>
              <textarea id="profile-address" rows="3" style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(0,0,0,0.2); color: var(--text-primary); resize: vertical;">${savedAddress}</textarea>
            </div>
            <button type="submit" style="background: var(--accent); color: white; border: none; padding: 12px; border-radius: var(--radius-sm); width: 100%; font-weight: 600; cursor: pointer; transition: background 0.2s;">Save Changes</button>
          </form>
        </div>

        <!-- Loyalty & Account Info -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 32px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">✨</div>
            <h3 style="font-family: var(--font-heading); color: var(--text-primary); font-size: 1.5rem; margin-bottom: 8px;">Guru Rewards</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 24px;">Earn points on every purchase and redeem them for free groceries.</p>
            <div style="display: inline-block; background: var(--bg-primary); border: 1px solid var(--accent); padding: 12px 32px; border-radius: var(--radius-xl); font-family: var(--font-heading); font-size: 1.8rem; font-weight: 700; color: var(--accent);">
              ${guruPoints} <span style="font-size: 1rem; color: var(--text-muted); font-weight: 500;">pts</span>
            </div>
          </div>

          <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-md); padding: 24px;">
            <h3 style="font-family: var(--font-heading); color: var(--red); font-size: 1.1rem; margin-bottom: 12px;">Danger Zone</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">If you want to permanently delete your account and all associated data, you can do so here.</p>
            <button onclick="if(confirm('Are you sure you want to delete your account? This action cannot be undone.')) { Auth.logout(); Toast.show('Account deleted successfully.'); }" style="background: transparent; border: 1px solid var(--red); color: var(--red); padding: 8px 16px; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; transition: background 0.2s;">Delete Account</button>
          </div>

        </div>
      </div>
    </div>
  `;
  initHeaderEvents();

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const newName = document.getElementById('profile-name').value.trim();
    const newAddress = document.getElementById('profile-address').value.trim();
    
    // Save address locally
    localStorage.setItem('guru_address', newAddress);
    
    // Mock updating user name
    const currentUser = Auth.getUser();
    currentUser.name = newName;
    Auth.setUser(currentUser, !!localStorage.getItem(Auth.STORAGE_KEY));
    
    btn.textContent = 'Saving...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = 'Changes Saved!';
      btn.style.background = '#22c55e'; // success green
      Toast.show('Profile updated successfully!');
      
      // Update header instantly
      const headerUser = document.querySelector('.header-user');
      if (headerUser) headerUser.innerHTML = `${currentUser.avatar} ${currentUser.name}`;

      setTimeout(() => {
        btn.textContent = 'Save Changes';
        btn.style.background = 'var(--accent)';
        btn.disabled = false;
      }, 2000);
    }, 800);
  });
}
