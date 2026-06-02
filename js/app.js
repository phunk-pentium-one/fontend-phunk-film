// ================================================
// app.js — Router / View Switching (Sistem Navigasi)
// ================================================
// Cara kerja: Semua halaman (view) sudah ada di index.html.
// Kita cukup show/hide setiap div berdasarkan navigasi.

let previousView = 'home'; // Untuk tombol "Kembali"

// Daftar semua view yang ada
const VIEWS = ['home', 'movies', 'detail', 'login', 'register', 'profile'];

// Fungsi utama navigasi — dipanggil saat user klik menu/tombol
function navigate(viewName) {
  // Simpan view sebelumnya
  if (currentView !== viewName) {
    previousView = currentView;
  }
  currentView = viewName;

  // Sembunyikan semua view
  VIEWS.forEach(v => {
    document.getElementById(`view-${v}`)?.classList.add('hidden');
  });

  // Tampilkan view yang dipilih
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Muat data sesuai view
  switch (viewName) {
    case 'home':
      loadHomeMovies();
      break;
    case 'movies':
      loadMovies();
      break;
    case 'profile':
      if (!isLoggedIn()) { navigate('login'); return; }
      loadProfilePage();
      break;
  }

  // Scroll ke atas saat pindah halaman
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Kembali ke halaman sebelumnya
function goBack() {
  navigate(previousView);
}

// Update tampilan navbar sesuai status login
function updateNavbar() {
  const loggedIn = isLoggedIn();

  document.getElementById('nav-login').style.display    = loggedIn ? 'none' : 'list-item';
  document.getElementById('nav-register').style.display = loggedIn ? 'none' : 'list-item';
  document.getElementById('nav-logout').style.display   = loggedIn ? 'list-item' : 'none';
  document.getElementById('nav-profile').style.display  = loggedIn ? 'list-item' : 'none';
}

// Isi halaman profil dengan data user
function loadProfilePage() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('profile-name').textContent     = user.name;
  document.getElementById('profile-username').textContent = '@' + user.username;
  document.getElementById('profile-email').textContent    = user.email;
  document.getElementById('profile-avatar').textContent   = user.name.charAt(0).toUpperCase();

  loadFavoriteMovies();
}

// Tampilkan notifikasi singkat (toast)
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');

  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ===== INISIALISASI — Dijalankan saat halaman pertama kali dibuka =====
let currentView = 'home';

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  navigate('home');
});
