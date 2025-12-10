let playlist = [];
let currentIndex = 0;
let seconds = 0;
const SongLength = 10;
let timerInterval = null;
let isPlaying = false;

// DOM
const titleEl = document.getElementById("song-title");
const albumEl = document.getElementById("song-artist");
const currentTimeEl = document.querySelector(".start-time");
const totalTimeEl = document.querySelector(".end-time");
const tbody = document.getElementById("happyPlaylist");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play");

// Funktion til tilbageknap
function goBack() {
    window.location.href = "categories.html";
}

// Play / Pause toggle
function togglePlay() {
    if (isPlaying) {
        // Pause
        clearInterval(timerInterval);
        isPlaying = false;
        playBtn.textContent = "▶";
    } else {
        // Play
        isPlaying = true;
        playBtn.textContent = "⏸";
        startTimer();
    }
}

// Hent playlist fra API
async function loadPartyPlaylist() {
    try {
        const res = await fetch("/api/happyPlaylist");
        playlist = await res.json();

        playlist.forEach((song, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td>${song.duration}</td>
            `;
            tbody.appendChild(row);
        });

        if (playlist.length > 0) {
            loadSong(0);
            isPlaying = true;  
            playBtn.textContent = "⏸"; 
            startTimer();
        }
    } catch (error) {
        console.error("Fejl ved hentning af playlist:", error);
    }
}

// Afspil valgt sang
function loadSong(index) {
    currentIndex = index;
    const song = playlist[index];

    titleEl.textContent = song.title;
    albumEl.textContent = song.artist;

    seconds = 0;
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (totalTimeEl) totalTimeEl.textContent = `0:${SongLength.toString().padStart(2,"0")}`;
    if (progressBar) progressBar.style.width = "0%";
}

// Dummy-timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!isPlaying) return;
        if (playlist.length === 0) return;

        seconds++;

        // Update current time
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        if (currentTimeEl) currentTimeEl.textContent = `${min}:${sec.toString().padStart(2,"0")}`;

        // Update progress bar
        if (progressBar) {
            const percent = (seconds / SongLength) * 100;
            progressBar.style.width = `${percent}%`;
        }

        // Skift sang når tiden er ovre
        if (seconds >= SongLength) {
            currentIndex = (currentIndex + 1) % playlist.length;
            loadSong(currentIndex);
        }
    }, 1000);
}

// Start med at hente playlist
loadPartyPlaylist();
