/* ===== Contact Page ===== */

async function renderContactPage() {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `
    <section class="hero">
      <h1>Get in Touch</h1>
      <p>Have questions or need support? We're here to help.</p>
    </section>
    
    <div style="max-width: var(--max-width); margin: 0 auto; padding: 48px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 48px;">
      
      <!-- Contact Form -->
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-sm);">
        <h2 style="font-family: var(--font-heading); margin-bottom: 24px; color: var(--accent);">Send us a Message</h2>
        <form id="contact-form" class="modal-form">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="contact-name" placeholder="Your Name" required style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.05); color: var(--text-primary);" />
          </div>
          <div class="form-group">
            <label>Email / Phone</label>
            <input type="text" id="contact-contact" placeholder="How can we reach you?" required style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.05); color: var(--text-primary);" />
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea id="contact-message" rows="5" placeholder="Type your message here..." required style="width:100%; padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); background: rgba(255,255,255,0.05); color: var(--text-primary); resize: vertical;"></textarea>
          </div>
          <button type="submit" class="login-btn" style="width:100%; margin-top: 8px;">Send Message</button>
        </form>
      </div>

      <!-- FAQ & Info -->
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h2 style="font-family: var(--font-heading); margin-bottom: 16px; color: var(--accent);">Contact Information</h2>
          <p style="color: var(--text-secondary); margin-bottom: 8px;">📍 <strong>Address:</strong> 123 Guru Enclave, Tech City, 400001</p>
          <p style="color: var(--text-secondary); margin-bottom: 8px;">📧 <strong>Email:</strong> support@groceryguru.com</p>
          <p style="color: var(--text-secondary); margin-bottom: 8px;">📞 <strong>Phone:</strong> +91 9792126604</p>
        </div>
        
        <div>
          <h2 style="font-family: var(--font-heading); margin-bottom: 16px; color: var(--accent);">Frequently Asked Questions</h2>
          <div style="background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px;">
            <strong style="color: var(--text-primary);">Do you offer same-day delivery?</strong>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px;">Yes! Orders placed before 2 PM are delivered the same day. Later orders arrive next morning.</p>
          </div>
          <div style="background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 16px;">
            <strong style="color: var(--text-primary);">What is the return policy?</strong>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 8px;">If you are not satisfied with the freshness of our products, you can request a return at the time of delivery.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  initHeaderEvents();

  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      e.target.reset();
      btn.textContent = 'Message Sent!';
      Toast.show('Thank you! Our support team will contact you shortly.');
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}
