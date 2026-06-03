// ================================================
// config.js — Konfigurasi URL API
// ================================================
//
// LANGKAH DEPLOYMENT:
// Setelah backend kamu sukses deploy ke Railway,
// kamu akan mendapat URL seperti:
//   https://cineworld-backend-production.up.railway.app
//
// Ganti nilai PRODUCTION_API_URL di bawah dengan URL Railway kamu!

const CONFIG = {
  // URL backend saat development (localhost)
  DEV_API_URL: 'http://localhost:3000/api',

  // URL backend setelah deploy ke Railway
  // Ganti ini dengan URL Railway kamu!
  PRODUCTION_API_URL: 'https://backend-phunk-film-production.up.railway.app/api',
};

// Deteksi otomatis: jika buka dari localhost → pakai dev URL
// Jika buka dari Vercel → pakai production URL
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API_URL = isLocalhost ? CONFIG.DEV_API_URL : CONFIG.PRODUCTION_API_URL;

// Tampilkan di konsol browser agar mudah debug
console.log(`🎬 CineWorld | Mode: ${isLocalhost ? 'Development' : 'Production'}`);
console.log(`🔗 API URL: ${API_URL}`);
