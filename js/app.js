// ================================================
// app.js — View Switching / Router
// ================================================

const VIEWS = ['home', 'movies', 'detail', 'login', 'register', 'profile'];
let currentView  = 'home';
let previousView = 'home';

function navigate(viewName) {
  if (currentView !== viewName) previousView = currentView;
  currentView = viewName;
  VIEWS.forEach(v => document.getElementById(`view-${v}`)?.classList.add('hidden'));
  document.getElementById(`view-${viewName}`)?.classList.remove('hidden');
  switch (viewName) {
    case 'home':    loadHomeMovies(); break;
    case 'movies':  loadMovies();     break;
    case 'profile':
      if (!isLoggedIn()) { navigate('login'); return; }
      loadProfilePage();
      break;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() { navigate(previousView); }

function updateNavbar() {
  const in_ = isLoggedIn();
  document.getElementById('nav-login').style.display    = in_ ? 'none' : 'list-item';
  document.getElementById('nav-register').style.display = in_ ? 'none' : 'list-item';
  document.getElementById('nav-logout').style.display   = in_ ? 'list-item' : 'none';
  document.getElementById('nav-profile').style.display  = in_ ? 'list-item' : 'none';
}

function loadProfilePage() {
  const user = getCurrentUser();
  if (!user) return;
  document.getElementById('profile-name').textContent     = user.name;
  document.getElementById('profile-username').textContent = '@' + user.username;
  document.getElementById('profile-email').textContent    = user.email;
  document.getElementById('profile-avatar').textContent   = user.name.charAt(0).toUpperCase();
  loadFavoriteMovies();
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  navigate('home');
});
