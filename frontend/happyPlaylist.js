// Globale variabler
let playlist = [];
let currentIndex = 0;

// DOM-elementer
const audio = document.getElementById("audio-player");
const cover = document.querySelector(".footer-album");
const titleEl = document.getElementById("song-title");
const albumEl = document.getElementById("song-artist");
const tbody = document.getElementById("happyPlaylist");

// Funktion til at gå tilbage til forrige side
function goBack() {
    window.history.back();
}

// Hent playlist fra API
async function loadPartyPlaylist() {
    try {
        const res = await fetch("/api/happyPlaylist");
        playlist = await res.json();

        // Fyld tabel med sange
        playlist.forEach((song, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td>${song.duration}</td>
            `;

            // Klik på rækken for at afspille sangen
            row.addEventListener("click", () => loadSong(index));

            tbody.appendChild(row);
        });

        // Afspil første sang automatisk
        if (playlist.length > 0) {
            loadSong(0);
        }

    } catch (error) {
        console.error("Fejl ved hentning af playlist:", error);
    }
}

// Afspil valgt sang
function loadSong(index) {
    currentIndex = index;
    const song = playlist[index];
    if (!song) return;

    titleEl.textContent = song.title;
    albumEl.textContent = song.artist;

    cover.style.backgroundImage = `url("${song.albumCover}")`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = "center";

    audio.src = song.audio || "";
    audio.play().catch(() => {});
}

// Gå videre til næste sang når den nuværende slutter
audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
});

// Start med at hente playlist
loadPartyPlaylist();
