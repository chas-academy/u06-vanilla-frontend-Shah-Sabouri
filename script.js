const API_URL = 'https://u05-music-library-api.onrender.com/api/songs';

let editId = null;

document.getElementById('addSongBtn').addEventListener('click', async() => {
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;

    if (editId) {
        //UPDATE ONE
        const response = await fetch(`${API_URL}/${editId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({ title, artist, genre, rating }),
        });

        const data = await response.json();
        alert('Låt uppdaterad!');
        editId = null;
        document.getElementById('addSongBtn').textContent = 'Lägg till låt';
    } else {
        // POST ONE
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, artist, genre, rating }),
        });
        const data = await response.json();
        alert('Låt tillagd!');
    }
    document.getElementById('title').value = '';
    document.getElementById('artist').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('rating').value = '';
    loadSongs();
});

async function loadSongs() {
    const response = await fetch(API_URL);
    const songs = await response.json();

    const container = document.getElementById('songsContainer');
    container.innerHTML = '';

    songs.forEach(song => {
        const div = document.createElement('div');
        div.innerHTML = `
        <strong>${song.title}</strong> | ${song.artist} | ${song.genre} | ⭐ ${song.rating}
        <button onclick="deleteSong('${song._id}')">Ta bort</button>
        <button onclick="editSong('${song._id}', '${song.title}', '${song.artist}', '${song.genre}', '${song.rating}')">Redigera</button>
        `;
        container.appendChild(div);
    });
}

async function deleteSong(id) {
    // DELETE ONE
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Låt raderad!');
    loadSongs();
}

function editSong(id, title, artist, genre, rating) {
    document.getElementById('title').value = title;
    document.getElementById('artist').value = artist;
    document.getElementById('genre').value = genre;
    document.getElementById('rating').value = rating;
    editId = id;
    document.getElementById('addSongBtn').textContent = 'Uppdatera låt';
}
  
window.onload = loadSongs;