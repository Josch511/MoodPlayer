
// VARIABLER
let playlist = [];
let currentIndex = 0;
let seconds = 0;
let timerInterval = null;
let isPlaying = false;

// DOM
let titleEl;
let albumEl;
let currentTimeEl;
let totalTimeEl;
let progressBar;
let playBtn;

// NAVIGATION
function goBack() {
    window.location.href = "categories.html";
}


// HELPERS
function formatDuration(ms = 0) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}


// LOAD PLAYLIST TABLE
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


// LOAD SONG
function loadSong(index) {
    if (!playlist.length) return;

    // Stop gammel timer
    clearInterval(timerInterval);
    timerInterval = null;

    currentIndex = index;
    seconds = 0;

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
    if (isPlaying) startTimer(durationSec);
}


// TIMER
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
    }, 1000);
}

// PLAY / PAUSE
function updatePlayButton() {
    playBtn.textContent = isPlaying ? "⏸" : "▶";
}

function togglePlayPause() {
    if (!playlist.length) return;

    isPlaying = !isPlaying;
    updatePlayButton();

    if (isPlaying && !timerInterval) {
        const durationSec = Math.floor(
            (playlist[currentIndex].duration_ms || 0) / 1000
        );
        startTimer(durationSec);
    }
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    // DOM refs
    titleEl = document.getElementById("song-title");
    albumEl = document.getElementById("song-artist");
    currentTimeEl = document.querySelector(".start-time");
    totalTimeEl = document.querySelector(".end-time");
    progressBar = document.querySelector(".progress-bar");
    playBtn = document.getElementById("play");

    // Playlist fra sessionStorage
    const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
    playlist = Array.isArray(data) ? data : [];

    // UI
    loadMatchedPlaylistIntoTable();

    if (playlist.length > 0) {
    isPlaying = true;      // 🔹 START AUTOMATISK
    updatePlayButton();   // 🔹 Vis pause-ikon
    loadSong(0);          // 🔹 Starter timeren
}


    playBtn.addEventListener("click", togglePlayPause);
    updatePlayButton();
});
