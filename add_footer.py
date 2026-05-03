import re

# 1. Update index.html to add footer
html_file = "public/index.html"
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

footer_html = """  <div id="app"></div>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="#/" class="logo">
          <span class="logo-icon">🧘‍♂️</span>
          <span>Grocery</span>Guru
        </a>
        <p class="footer-tagline">Shop smarter with the grocery guru. We deliver fresh, premium quality groceries right to your doorstep.</p>
        <div class="footer-socials">
          <a href="#" class="social-icon">📘</a>
          <a href="#" class="social-icon">📸</a>
          <a href="#" class="social-icon">🐦</a>
        </div>
      </div>
      <div class="footer-links">
        <div class="footer-column">
          <h3>Shop</h3>
          <a href="#/">All Products</a>
          <a href="#/">Fresh Fruits</a>
          <a href="#/">Vegetables</a>
          <a href="#/">Dairy & Bakery</a>
        </div>
        <div class="footer-column">
          <h3>Support</h3>
          <a href="#">Help Center</a>
          <a href="#">Delivery Info</a>
          <a href="#">Returns & Refunds</a>
          <a href="#/contact">Contact Us</a>
        </div>
        <div class="footer-column">
          <h3>Legal</h3>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Grocery Guru. All rights reserved.</p>
    </div>
  </footer>

  <div id="toast-container"></div>"""

if "<!-- Footer -->" not in html_content:
    html_content = html_content.replace('  <div id="app"></div>\n  <div id="toast-container"></div>', footer_html)
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

# 2. Add Footer CSS to styles.css
css_file = "public/css/styles.css"
footer_css = """
/* ===== Footer ===== */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-glass);
  padding: 64px 24px 24px;
  margin-top: 80px;
}
.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  justify-content: space-between;
  margin-bottom: 48px;
}
.footer-brand {
  max-width: 320px;
}
.footer-tagline {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 16px 0 24px;
  line-height: 1.6;
}
.footer-socials {
  display: flex;
  gap: 16px;
}
.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-glass);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: var(--transition);
  text-decoration: none;
}
.social-icon:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-3px);
}
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 64px;
}
.footer-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.footer-column h3 {
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.footer-column a {
  color: var(--text-secondary);
  font-size: 0.95rem;
  transition: var(--transition);
  text-decoration: none;
}
.footer-column a:hover {
  color: var(--accent);
}
.footer-bottom {
  max-width: var(--max-width);
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid var(--border-glass);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-inner {
    flex-direction: column;
    gap: 40px;
  }
  .footer-links {
    gap: 40px;
  }
}
"""

with open(css_file, "r", encoding="utf-8") as f:
    css_content = f.read()

if "/* ===== Footer ===== */" not in css_content:
    with open(css_file, "a", encoding="utf-8") as f:
        f.write(footer_css)

print("Footer added.")
