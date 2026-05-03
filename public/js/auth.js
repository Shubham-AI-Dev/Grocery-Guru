/* ===== Auth State (localStorage) with Remember Me ===== */
const Auth = {
  KEY: 'freshcart_user',
  STORAGE_KEY: 'freshcart_storage', // 'session' or 'local'

  getUser() {
    try {
      const storage = this._getStorageType();
      return JSON.parse(storage.getItem(this.KEY)) || null;
    } catch {
      return null;
    }
  },

  setUser(user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    sessionStorage.setItem(this.STORAGE_KEY, rememberMe ? 'local' : 'session');
    storage.setItem(this.KEY, JSON.stringify(user));
  },

  _getStorageType() {
    const storageType = sessionStorage.getItem(this.STORAGE_KEY) || 'session';
    return storageType === 'local' ? localStorage : sessionStorage;
  },

  logout() {
    localStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    Cart.clear();
    window.location.hash = '#/login';
  },

  isLoggedIn() {
    return this.getUser() !== null;
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) {
      window.location.hash = '#/';
      return false;
    }
    return true;
  },
};
