// Variabler
let playlist = [];
let currentIndex = 0;
let seconds = 0;
let timerInterval = null;
let isPlaying = false;

// DOM
let titleEl, albumEl, currentTimeEl, totalTimeEl, progressBar, playBtn;

// Funktion til tilbageknap
function goBack() {
    window.location.href = "categories.html";
}

// Format duration from ms to mm:ss
function formatDuration(ms = 0) {
    const totalSec = Math.floor(ms / 100);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Format duration from seconds to mm:ss
function formatSeconds(sec = 0) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Afspil valgt sang
function loadSong(index) {
    if (!playlist || playlist.length === 0) return;

    currentIndex = index;
    const song = playlist[currentIndex];

    // Footer
    if (titleEl) titleEl.textContent = song.track_name || "-";
    if (albumEl) albumEl.textContent = song.artists || "-";

    // Reset timer
    seconds = 0;
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (progressBar) progressBar.style.width = "0%";

    // Tjek om duration er i ms eller sekunder
    let durationMs = song.duration;
    if (durationMs > 1000) {
        // antag at alt >1000 er ms
        song._durationSec = Math.floor(durationMs / 100);
    } else {
        // ellers er det allerede i sekunder
        song._durationSec = durationMs || 10;
        durationMs = song._durationSec * 100;
    }

    // Sæt total tid
    if (totalTimeEl) totalTimeEl.textContent = formatDuration(durationMs);
}


// Opdater play-knap 
function updatePlayButton() {
    if (!playBtn) return;
    playBtn.textContent = isPlaying ? "⏸" : "▶";
}

// Timer baseret på faktisk sanglængde
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isPlaying || !playlist.length) return;

        seconds++;
        const song = playlist[currentIndex];
        const durationSec = song._durationSec || 10;

        // Update current time
        if (currentTimeEl) currentTimeEl.textContent = formatSeconds(seconds);

        // Update progress bar
        if (progressBar) {
            const percent = Math.min(100, (seconds / durationSec) * 100);
            progressBar.style.width = `${percent}%`;
        }

        // Skift sang når sangen er færdig
        if (seconds >= durationSec) {
            currentIndex = (currentIndex + 1) % playlist.length;
            loadSong(currentIndex);
        }

    }, 100);
}

// Toggle play/pause
function togglePlayPause() {
    if (!playlist || playlist.length === 0) return;
    isPlaying = !isPlaying;
    updatePlayButton();
    if (isPlaying) startTimer();
}

// Load playlist i tabel
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
            <td>${formatDuration(song.duration || 0)}</td>
        `;
        tbody.appendChild(row);
    });

    if (playlist.length > 0) {
        loadSong(0);
        isPlaying = true;
        updatePlayButton();
        startTimer();
    }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    titleEl = document.getElementById("song-title");
    albumEl = document.getElementById("song-artist");
    currentTimeEl = document.querySelector(".start-time");
    totalTimeEl = document.querySelector(".end-time");
    progressBar = document.querySelector(".progress-bar");
    playBtn = document.getElementById("play");

    // hent playlist fra sessionStorage
    const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
    playlist = Array.isArray(data) ? data : [];

    console.log("Matched songs on mood page:", playlist);

    loadMatchedPlaylistIntoTable();

    if (playBtn) playBtn.addEventListener("click", togglePlayPause);
});
