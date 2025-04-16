const API_URL = 'https://u05-music-library-api.onrender.com/api/songs';

document.getElementById('addSongBtn').addEventListener('click', async() => {
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, genre, rating }),
    });

    const data = await response.json();
    alert('Låt tillagd!');
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