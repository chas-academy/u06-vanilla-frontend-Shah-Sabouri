const API_URL = 'https://u05-music-library-api.onrender.com/api/songs';

let editId = null;
let sortOrder = 'desc'; // Standard är sortering från högst till lägst betyg

// Lyssna på formulärets "submit" (sökning)
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('searchInput').value.trim();
    loadSongs(searchValue);
});

// Lyssna på "Visa alla"-knappen
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    loadSongs();
});

// Lyssna på sorteringsknappen
document.getElementById('sortBtn').addEventListener('click', () => {
    // Växla sorteringsordning
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    loadSongs(); // Ladda om låtarna med den nya sorteringen
});

// Lägg till eller uppdatera låt
document.getElementById('addSongBtn').addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const rating = document.getElementById('rating').value.trim();

    if (!title || !artist || !genre || !rating) {
        alert('Alla fält måste fyllas i!');
        return;
    }

    const songData = { title, artist, genre, rating };

    if (editId) {
        // UPDATE
        await fetch(`${API_URL}/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData),
        });
        alert('Låt uppdaterad!');
        editId = null;
        document.getElementById('addSongBtn').textContent = 'Lägg till låt';
        document.getElementById('cancelEditBtn').style.display = 'none';
    } else {
        // CREATE
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData),
        });
        alert('Låt tillagd!');
    }

    clearForm();
    loadSongs();
});

// Avbryt redigering
document.getElementById('cancelEditBtn').addEventListener('click', () => {
    clearForm();
    editId = null;
    document.getElementById('addSongBtn').textContent = 'Lägg till låt';
    document.getElementById('cancelEditBtn').style.display = 'none';
});

// Funktion för att hämta låtar (med valfri sökterm)
async function loadSongs(searchTerm = '') {
    let url = API_URL;
    if (searchTerm) {
        url += `?artist=${encodeURIComponent(searchTerm)}&sort=${sortOrder}`;
    } else {
        url += `?sort=${sortOrder}`; // Hämta låtar sorterade efter det aktuella sorteringsordningen
    }

    const response = await fetch(url);
    const songs = await response.json();

    const container = document.getElementById('songContainer');
    container.innerHTML = '';

    if (Array.isArray(songs) && songs.length > 0) {
        songs.forEach(song => {
            const div = document.createElement('div');
            div.classList.add('song-card');
            div.innerHTML = `
                <div class="song-info">
                    <strong>${song.title}</strong> - ${song.artist} (${song.genre}) ⭐${song.rating}
                </div>
                <div class="buttons">
                    <button onclick="editSong('${song._id}', '${song.title}', '${song.artist}', '${song.genre}', '${song.rating}')">Redigera</button>
                    <button onclick="deleteSong('${song._id}')">Ta bort</button>
                </div>
            `;
            container.appendChild(div);
        });
    } else {
        container.innerHTML = '<p>Inga låtar hittades.</p>';
    }
}

// Funktion för att radera en låt
async function deleteSong(id) {
    if (confirm('Är du säker på att du vill ta bort låten?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert('Låt raderad!');
        loadSongs();
    }
}

// Funktion för att börja redigera en låt
function editSong(id, title, artist, genre, rating) {
    document.getElementById('title').value = title;
    document.getElementById('artist').value = artist;
    document.getElementById('genre').value = genre;
    document.getElementById('rating').value = rating;
    editId = id;
    document.getElementById('addSongBtn').textContent = 'Uppdatera låt';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

// Rensar formuläret
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('rating').value = '';
}

// När sidan laddas
window.onload = () => {
    loadSongs();
};
