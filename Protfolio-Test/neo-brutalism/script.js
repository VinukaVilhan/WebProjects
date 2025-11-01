// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

function getStoredTheme() {
  try { return localStorage.getItem('theme'); } catch (_) { return null; }
}
function setStoredTheme(value) {
  try { localStorage.setItem('theme', value); } catch (_) { /* ignore */ }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (toggle) toggle.setAttribute('aria-pressed', 'true');
  } else {
    root.removeAttribute('data-theme');
    if (toggle) toggle.setAttribute('aria-pressed', 'false');
  }
}

// Initialize theme
applyTheme(getStoredTheme());

if (toggle) {
  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next === 'dark' ? 'dark' : '');
  });
}

// Small interaction: fake form submit
const form = document.querySelector('.newsletter');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = /** @type {HTMLInputElement|null} */(document.getElementById('email'));
    if (email && email.value.trim()) {
      alert('Thanks! We\'ll keep you posted.');
      email.value = '';
    }
  });
}


