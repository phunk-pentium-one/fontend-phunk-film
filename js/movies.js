// ================================================
// movies.js — Logika tampil film, detail, favorit
// ================================================

let allMovies = []; // Menyimpan semua film untuk fitur pencarian

// Ambil dan tampilkan semua film di halaman Movies
async function loadMovies() {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '<p class="loading-text">Memuat film...</p>';

  const result = await apiRequest('/movies');
  if (!result || !result.ok) {
    grid.innerHTML = '<p class="loading-text">Gagal memuat film.</p>';
    return;
  }

  allMovies = result.data;
  renderMoviesGrid(allMovies, 'movies-grid');
}

// Ambil dan tampilkan film di halaman Home (hanya beberapa saja)
async function loadHomeMovies() {
  const grid = document.getElementById('home-movies-grid');
  grid.innerHTML = '<p class="loading-text">Memuat film...</p>';

  const result = await apiRequest('/movies?limit=8');
  if (!result || !result.ok) {
    grid.innerHTML = '<p class="loading-text">Gagal memuat film.</p>';
    return;
  }

  renderMoviesGrid(result.data, 'home-movies-grid');
}

// Render kartu-kartu film ke dalam grid
function renderMoviesGrid(movies, gridId) {
  const grid = document.getElementById(gridId);

  if (!movies || movies.length === 0) {
    grid.innerHTML = '<p class="loading-text">Tidak ada film ditemukan.</p>';
    return;
  }

  grid.innerHTML = movies.map(movie => `
    <div class="movie-card" onclick="showMovieDetail(${movie.id})">
      <div class="movie-poster">
        ${movie.poster_url
          ? `<img class="movie-poster-img" src="${movie.poster_url}" alt="${movie.title}" onerror="this.parentElement.innerHTML='🎬'" />`
          : '🎬'
        }
      </div>
      <div class="movie-card-info">
        <div class="movie-card-title">${movie.title}</div>
        <div class="movie-card-year">${movie.year || ''}</div>
        <div class="movie-card-rating">★ ${movie.rating || 'N/A'}</div>
      </div>
    </div>
  `).join('');
}

// Tampilkan halaman detail satu film
async function showMovieDetail(movieId) {
  navigate('detail');
  const container = document.getElementById('movie-detail-content');
  container.innerHTML = '<p class="loading-text">Memuat detail...</p>';

  const result = await apiRequest(`/movies/${movieId}`);
  if (!result || !result.ok) {
    container.innerHTML = '<p class="loading-text">Gagal memuat detail film.</p>';
    return;
  }

  const m = result.data;
  const genres = m.genres ? m.genres.split(',').map(g => `<span class="badge genre">${g.trim()}</span>`).join('') : '';
  const cast   = m.cast ? m.cast.split(',').map(c => `<span class="cast-tag">${c.trim()}</span>`).join('') : 'Tidak ada data';

  const favBtn = isLoggedIn()
    ? `<button class="btn-fav" onclick="toggleFavorite(${m.id}, this)">♥ Simpan ke Favorit</button>`
    : `<a href="#" onclick="navigate('login')">Masuk untuk menyimpan favorit</a>`;

  container.innerHTML = `
    <div class="detail-poster">
      ${m.poster_url
        ? `<img src="${m.poster_url}" alt="${m.title}" onerror="this.parentElement.innerHTML='🎬'" />`
        : '🎬'
      }
    </div>
    <div class="detail-info">
      <h1>${m.title}</h1>
      <div class="detail-meta">
        <span class="badge">${m.year || 'N/A'}</span>
        <span class="badge">${m.duration ? m.duration + ' menit' : 'N/A'}</span>
        <span class="rating-big">★ ${m.rating || 'N/A'}</span>
        ${genres}
      </div>
      <p class="detail-synopsis">${m.synopsis || 'Sinopsis tidak tersedia.'}</p>
      <div class="detail-cast">
        <h3>Pemeran</h3>
        <div class="cast-list">${cast}</div>
      </div>
      ${favBtn}
    </div>
  `;

  // Cek apakah sudah jadi favorit
  if (isLoggedIn()) {
    checkIfFavorite(m.id);
  }
}

// Fitur pencarian film (filter sisi klien)
function searchMovies() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = allMovies.filter(m =>
    m.title.toLowerCase().includes(query) ||
    (m.genres && m.genres.toLowerCase().includes(query))
  );
  renderMoviesGrid(filtered, 'movies-grid');
}

// Tambah/hapus film dari favorit
async function toggleFavorite(movieId, btn) {
  if (!isLoggedIn()) { navigate('login'); return; }

  const result = await apiRequest(`/movies/${movieId}/favorite`, 'POST');
  if (result && result.ok) {
    const isFav = result.data.favorited;
    btn.textContent = isFav ? '♥ Tersimpan' : '♥ Simpan ke Favorit';
    btn.style.background = isFav ? 'var(--accent)' : '';
    btn.style.color = isFav ? '#fff' : '';
    showToast(isFav ? 'Ditambahkan ke favorit!' : 'Dihapus dari favorit.', 'success');
  }
}

// Cek status favorit saat halaman detail dibuka
async function checkIfFavorite(movieId) {
  const result = await apiRequest(`/movies/${movieId}/favorite`);
  if (result && result.ok && result.data.favorited) {
    const btn = document.querySelector('.btn-fav');
    if (btn) {
      btn.textContent = '♥ Tersimpan';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
    }
  }
}

// Tampilkan film favorit user di halaman Profil
async function loadFavoriteMovies() {
  const grid = document.getElementById('favorite-movies');
  grid.innerHTML = '<p class="loading-text">Memuat favorit...</p>';

  const result = await apiRequest('/movies/favorites');
  if (!result || !result.ok || result.data.length === 0) {
    grid.innerHTML = `<p class="empty-state">Belum ada film favorit. <a href="#" onclick="navigate('movies')">Cari film</a></p>`;
    return;
  }

  renderMoviesGrid(result.data, 'favorite-movies');
}
