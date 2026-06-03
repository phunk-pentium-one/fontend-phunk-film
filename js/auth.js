// ================================================
// auth.js — Login, Register, Logout
// ================================================

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorEl  = document.getElementById('login-error');
  errorEl.classList.add('hidden');

  const result = await apiRequest('/auth/login', 'POST', { username, password });

  if (result && result.ok) {
    localStorage.setItem('token', result.data.token);
    localStorage.setItem('user', JSON.stringify(result.data.user));
    showToast(`Selamat datang, ${result.data.user.name}! 👋`, 'success');
    updateNavbar();
    navigate('home');
  } else {
    errorEl.textContent = result?.data?.message || 'Login gagal';
    errorEl.classList.remove('hidden');
  }
}

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
    errorEl.textContent = result?.data?.message || 'Registrasi gagal';
    errorEl.classList.remove('hidden');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavbar();
  showToast('Kamu berhasil keluar.', 'success');
  navigate('home');
}

function isLoggedIn() { return !!localStorage.getItem('token'); }

function getCurrentUser() {
  const d = localStorage.getItem('user');
  return d ? JSON.parse(d) : null;
}
