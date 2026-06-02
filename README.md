# CineWorld Frontend — Panduan Belajar

## Struktur File

```
frontend/
├── index.html       ← Satu file HTML berisi semua halaman (view)
├── css/
│   └── style.css    ← Semua style/tampilan
├── js/
│   ├── api.js       ← Fungsi untuk berkomunikasi dengan backend
│   ├── auth.js      ← Login, Register, Logout
│   ├── movies.js    ← Tampil film, detail, favorit
│   └── app.js       ← Router / sistem navigasi view
└── README.md        ← File ini
```

---

## Cara Menjalankan

### Cara 1 — Langsung buka di browser (tanpa server)
Cukup double-click file `index.html`.
⚠️ Fitur yang butuh backend (login, data film) tidak akan berfungsi.

### Cara 2 — Dengan Live Server (direkomendasikan)
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan `index.html` → **Open with Live Server**
3. Pastikan backend sudah berjalan di http://localhost:3000

---

## Konsep: View Switching (SPA sederhana)

Website ini menggunakan teknik **View Switching** — semua halaman ada di
satu file `index.html`, tapi hanya satu yang ditampilkan pada satu waktu.

```html
<!-- Semua view ada di HTML -->
<div id="view-home">...</div>
<div id="view-movies" class="hidden">...</div>
<div id="view-login" class="hidden">...</div>
```

```javascript
// Saat navigasi, semua view disembunyikan, lalu yang dipilih ditampilkan
function navigate(viewName) {
  ['home', 'movies', 'login'].forEach(v =>
    document.getElementById(`view-${v}`).classList.add('hidden')
  );
  document.getElementById(`view-${viewName}`).classList.remove('hidden');
}
```

Ini lebih sederhana dari framework seperti React/Vue, tapi konsepnya sama.

---

## Alur Data (Frontend → Backend)

```
User klik tombol Login
    ↓
handleLogin() di auth.js dipanggil
    ↓
apiRequest('/auth/login', 'POST', { username, password }) di api.js
    ↓
Fetch ke http://localhost:3000/api/auth/login
    ↓
Backend memverifikasi → kirim token JWT
    ↓
Token disimpan di localStorage browser
    ↓
Navbar diupdate, user diarahkan ke beranda
```

---

## Cara Menghubungkan ke Backend

Buka file `js/api.js` dan pastikan URL ini sesuai dengan port backend kamu:

```javascript
const API_URL = 'http://localhost:3000/api';
```

Jika kamu menjalankan backend di port berbeda (misalnya 5000), ubah menjadi:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## Menambah Halaman Baru

1. **Tambah view di `index.html`**:
```html
<div id="view-tentang" class="view hidden">
  <h1>Tentang CineWorld</h1>
  <p>Website film buatan sendiri!</p>
</div>
```

2. **Tambah di array VIEWS di `app.js`**:
```javascript
const VIEWS = ['home', 'movies', 'detail', 'login', 'register', 'profile', 'tentang'];
```

3. **Tambah link di navbar `index.html`**:
```html
<li><a href="#" onclick="navigate('tentang')">Tentang</a></li>
```

Selesai! Halaman baru sudah bisa diakses.
