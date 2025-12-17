
// Variabler
let playlist = [];
let currentIndex = 0;
let seconds = 0;
let timerInterval = null;
let isPlaying = false;

// dom manipulation 
let titleEl;
let albumEl;
let currentTimeEl;
let totalTimeEl;
let progressBar;
let playBtn;



// Tilbage knap 
function goBack() {
    window.location.href = "categories.html";
}


// formatere fra ms til m:s
function formatDuration(ms = 0) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}


// loader playlisten
function loadMatchedPlaylistIntoTable() {
    const tbody = document.getElementById("moodplaylist");
    if (!tbody) return;

    tbody.innerHTML = "";

    playlist.forEach((song, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${song.track_name || "-"}</td>
            <td>${song.artists || "-"}</td>
            <td>${song.album_name || "-"}</td>
            <td>${formatDuration(song.duration_ms)}</td>
        `;
        tbody.appendChild(row);
    });
}


// loader sangene 
function loadSong(currentIndex) {
    if (!playlist.length) return;

    // Stop gammel timer
    clearInterval(timerInterval);
    timerInterval = null;

    const song = playlist[currentIndex];
    const durationSec = Math.floor((song.duration_ms || 0) / 1000);

    // Titel & artist
    titleEl.textContent = song.track_name || "-";
    albumEl.textContent = song.artists || "-";

    // Tider
    currentTimeEl.textContent = "0:00";
    totalTimeEl.textContent = formatDuration(song.duration_ms);

    // Progress
    progressBar.style.width = "0%";

    // Start hvis play
    if (isPlaying) { 
        startTimer(durationSec);
    }
}


// Timer
function startTimer(durationSec) {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isPlaying) return;

        seconds++;

        // Opdater tid
        currentTimeEl.textContent =
            `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

        // Progress
        const percent = Math.min(100, (seconds / durationSec) * 100);
        progressBar.style.width = `${percent}%`;

        // Næste sang
        if (seconds >= durationSec) {
            clearInterval(timerInterval);
            loadSong((currentIndex + 1) % playlist.length);
        }
    // 1000 ms = 1 sekund
    }, 1000);
}

// Play / Pause 
function updatePlayButton() {
    playBtn.textContent = isPlaying ? "⏸" : "▶";
}


function togglePlayPause() {
    // Hvis der ingen sange er, så gør funktionen ingenting
    if (!playlist.length) return;

    // Hvis isPlaying var false → bliver true play
    // Hvis isPlaying var true → bliver false pause
    isPlaying = !isPlaying;
    updatePlayButton();
}

// Venter på at alt content er loaded
document.addEventListener("DOMContentLoaded", () => {
    // DOM manipulation
    titleEl = document.getElementById("song-title");
    albumEl = document.getElementById("song-artist");
    currentTimeEl = document.querySelector(".start-time");
    totalTimeEl = document.querySelector(".end-time");
    progressBar = document.querySelector(".progress-bar");
    playBtn = document.getElementById("play");

    // Playlist fra sessionStorage
    const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
    playlist = Array.isArray(data) ? data : [];
    console.log(data);

    // kalder vores funktion 
    loadMatchedPlaylistIntoTable();

    if (playlist.length > 0) {
    isPlaying = true;      // Start sang automatisk
    updatePlayButton();   // Vis pause-ikon
    loadSong(0);          // Starter timeren
}

    // kalder funktion til playbtn 
    playBtn.addEventListener("click", togglePlayPause);
    updatePlayButton();
});
