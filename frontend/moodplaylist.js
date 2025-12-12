// Variabler
let playlist = [];
let currentIndex = 0;
let seconds = 0;
const SongLength = 10;
let timerInterval = null;
let isPlaying = false;

// DOM
let titleEl = document.getElementById("song-title");
let albumEl = document.getElementById("song-artist");
let currentTimeEl = document.querySelector(".start-time");
let totalTimeEl = document.querySelector(".end-time");
let progressBar = document.querySelector(".progress-bar");
let playBtn = document.getElementById("play");

// Funktion til tilbageknap
function goBack() {
    window.location.href = "categories.html";
}

// Format duration from ms to mm:ss
function formatDuration(ms = 0) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Henter matchedsongs fra sessionstorage fra setupMood.js
const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
playlist = data;
console.log("Matched songs on mood page:", data);

// Load matched playlist into table
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

    // gør så den starter afspilning så snart man trykker ind på playlisten
    if (playlist.length > 0) {
            loadSong(0);
            isPlaying = true;
            playBtn.textContent = "⏸";
            startTimer();
        }
}

// Afspil valgt sang
function loadSong(index) {
    if (!playlist || playlist.length === 0) return;

    currentIndex = index;
    const song = playlist[currentIndex];

    if (titleEl) titleEl.textContent = song.track_name || "-";
    if (albumEl) albumEl.textContent = song.artists || "-";

    // Reset timer
    seconds = 0;
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (progressBar) progressBar.style.width = "0%";

    // Brug duration_ms i stedet for parseDurationString
    const durationSec = Math.floor((song.duration_ms || SongLength * 1000) / 1000);
    song._durationSec = durationSec;

    if (totalTimeEl) {
        totalTimeEl.textContent = `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2,"0")}`;
    }
}



// Opdater play-knap 
function updatePlayButton() {
    if (!playBtn) return;
    playBtn.textContent = isPlaying ? "⏸" : "▶";
}

// Dummy-timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isPlaying) return;
        if (!playlist || playlist.length === 0) return;

        seconds++;

        // Update current time
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        if (currentTimeEl) currentTimeEl.textContent = `${min}:${sec.toString().padStart(2,"0")}`;

        // Update progress bar
        const duration = playlist[currentIndex]._durationSec || SongLength; // brug faktisk sanglængde
        const percent = Math.min(100, (seconds / duration) * 100);
        if (progressBar) progressBar.style.width = `${percent}%`;

        // Skift sang når tiden er ovre
        if (seconds >= duration) {
            currentIndex = (currentIndex + 1) % playlist.length;
            loadSong(currentIndex);
        }

    }, 1000);
}


// Toggle play/pause (kan kaldes fra knap)
function togglePlayPause() {
    if (!playlist || playlist.length === 0) return;
    isPlaying = !isPlaying;
    updatePlayButton();
    if (isPlaying) startTimer();
}

// initiate når dommen er klar 
document.addEventListener("DOMContentLoaded", () => {
    // henter DOM elementer nu
    titleEl = document.getElementById("song-title");
    albumEl = document.getElementById("song-artist");
    currentTimeEl = document.querySelector(".start-time");
    totalTimeEl = document.querySelector(".end-time");
    progressBar = document.querySelector(".progress-bar");
    playBtn = document.getElementById("play");

    // henter data fra sessionStorage 
    const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
    playlist = Array.isArray(data) ? data : [];
    console.log("Matched songs on mood page:", playlist);

    // fyld tabel
    loadMatchedPlaylistIntoTable();

    // hvis vi har mindst én sang, load første sang (men start ikke afspil automatisk medmindre du vil)
    if (playlist.length > 0) {
        loadSong(0);
    }

    // play-knap event
    if (playBtn) {
        playBtn.addEventListener("click", togglePlayPause);
        updatePlayButton();
    } else {
        console.log("Play-knap (#play) ikke fundet i DOM. Tjek at knappen findes.");
    }
});



