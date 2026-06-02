// ================================================
// api.js — Fungsi untuk berkomunikasi dengan backend
// ================================================

const API_URL = 'http://localhost:3000/api';

// Fungsi utama untuk mengirim request ke backend
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };

  // Jika ada token login, tambahkan ke header sebagai "Bearer Token"
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // Jika server mengembalikan 401 (token expired/tidak valid)
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      updateNavbar();
      navigate('login');
      return null;
    }

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API Error:', error);
    return { ok: false, data: { message: 'Tidak bisa terhubung ke server. Pastikan backend berjalan.' } };
  }
}
