/* ===== SPA Router & App Init ===== */
(function () {
  function getRoute() {
    const hash = window.location.hash || '#/';
    return hash.slice(1); // remove #
  }

  async function router() {
    const path = getRoute();

    // Login page — accessible without auth
    if (path === '/login') {
      if (Auth.isLoggedIn()) {
        window.location.hash = Auth.isAdmin() ? '#/admin' : '#/';
        return;
      }
      await renderLoginPage();
      return;
    }

    // Admin routes — require admin role
    if (path === '/admin') {
      if (!Auth.isLoggedIn()) { window.location.hash = '#/login'; return; }
      if (!Auth.isAdmin()) { window.location.hash = '#/'; return; }
      await renderAdminPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path === '/checkout') {
      if (!Auth.isLoggedIn()) {
        window.location.hash = '#/login';
        Toast.show('Please sign in to complete your order.');
        return;
      }
      await renderCheckoutPage();
    } else if (path === '/contact') {
      await renderContactPage();
    } else if (path === '/' || path === '') {
      await renderHomePage();
    } else if (path.startsWith('/product/')) {
      const id = path.split('/product/')[1];
      await renderProductPage(id);
    } else if (path === '/profile') {
      await renderProfilePage();
    } else if (path === '/orders') {
      await renderOrdersPage();
    } else if (path === '/cart') {
      await renderCartPage();
    } else {
      await renderHomePage();
    }

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);

  // Newsletter Form Logic
  const newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsForm.querySelector('button');
      btn.textContent = 'Done!';
      btn.style.background = '#22c55e'; // green success
      Toast.show('Successfully subscribed to the Grocery Guru newsletter!');
      newsForm.reset();
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = ''; // revert
      }, 3000);
    });
  }
})();

