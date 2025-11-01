// Simple ripple effect for buttons and chips
document.addEventListener('click', function(e) {
  const target = /** @type {HTMLElement} */(e.target);
  const host = target.closest('[data-ripple]') || (target.matches('.md-button') ? target : null);
  if (!host) return;
  const rect = host.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
  host.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Quote button scroll to contact
const quoteBtn = document.getElementById('quoteBtn');
if (quoteBtn) {
  quoteBtn.addEventListener('click', () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
}


