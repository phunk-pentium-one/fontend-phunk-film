// ================================================
// auth.js — Logika Login, Register, dan Logout
// ================================================

// Menangani form LOGIN
async function handleLogin(event) {
  event.preventDefault(); // Mencegah halaman reload

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  // Sembunyikan pesan error sebelumnya
  errorEl.classList.add('hidden');

  const result = await apiRequest('/auth/login', 'POST', { username, password });

  if (result && result.ok) {
    // Simpan token JWT dan data user ke localStorage (penyimpanan browser)
    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));

    showToast(`Selamat datang, ${result.data.user.name}! 👋`, 'success');
    updateNavbar();
    navigate('home');
  } else {
    const msg = result?.data?.message || 'Login gagal';
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
}

// Menangani form REGISTER
async function handleRegister(event) {
  event.preventDefault();

  const name     = document.getElementById('reg-name').value;
  const username = document.getElementById('reg-username').value;
  const email    = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const errorEl   = document.getElementById('register-error');
  const successEl = document.getElementById('register-success');

  errorEl.classList.add('hidden');
  successEl.classList.add('hidden');

  const result = await apiRequest('/auth/register', 'POST', { name, username, email, password });

  if (result && result.ok) {
    successEl.textContent = 'Akun berhasil dibuat! Silakan masuk.';
    successEl.classList.remove('hidden');
    document.getElementById('register-form').reset();

    setTimeout(() => navigate('login'), 1500);
  } else {
    const msg = result?.data?.message || 'Registrasi gagal';
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }
}

// LOGOUT — hapus data dari browser
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavbar();
  showToast('Kamu berhasil keluar.', 'success');
  navigate('home');
}

// Cek apakah user sudah login
function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Ambil data user yang sedang login
function getCurrentUser() {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}
