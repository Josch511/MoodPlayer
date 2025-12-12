// VARIABLER
let playlist = [];
let currentIndex = 0;
let seconds = 0;
const SongLength = 10;
let timerInterval = null;
let isPlaying = false;

// DOM MANIPULATION
const titleEl = document.getElementById("song-title");
const albumEl = document.getElementById("song-artist");
const currentTimeEl = document.querySelector(".start-time");
const totalTimeEl = document.querySelector(".end-time");
const progressBar = document.querySelector(".progress-bar");
const playBtn = document.getElementById("play");

// FUNKTION TIL TILBAGEKNAP
function goBack() {
    window.location.href = "categories.html";
}

// PLAY / PAUSE FUNKTION
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

// WORKOUT PLAYLIST
async function loadWorkoutPlaylist() {
    try {
        const res = await fetch("/api/workoutPlaylist");
        playlist = await res.json();

        const tbody = document.getElementById("workoutPlaylist");
        if (!tbody) return;
        tbody.innerHTML = "";

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

// SAD PLAYLIST
async function loadSadPlaylist() {
    try {
        const res = await fetch("/api/sadPlaylist");
        playlist = await res.json();

        const tbody = document.getElementById("sadPlaylist");
        if (!tbody) return;
        tbody.innerHTML = "";

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

// PARTY PLAYLIST
async function loadPartyPlaylist() {
    try {
        const res = await fetch("/api/partyPlaylist");
        playlist = await res.json();

        const tbody = document.getElementById("partyPlaylist");
        if (!tbody) return;
        tbody.innerHTML = "";

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

// HAPPY PLAYLIST
async function loadHappyPlaylist() {
    try {
        const res = await fetch("/api/happyPlaylist");
        playlist = await res.json();

        const tbody = document.getElementById("happyPlaylist");
        if (!tbody) return;
        tbody.innerHTML = "";

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

// CHILL PLAYLIST
async function loadChillPlaylist() {
    try {
        const res = await fetch("/api/chillPlaylist");
        playlist = await res.json();

        const tbody = document.getElementById("chillPlaylist");
        if (!tbody) return;
        tbody.innerHTML = "";

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

// AFSPIL NÆSTE SANG
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

// DUMMY TIMER
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
// LOADER DE FORSKELLIGE PLAYLISTER 
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("sadPlaylist")) {
        loadSadPlaylist();
    } else if (document.getElementById("happyPlaylist")) {
        loadHappyPlaylist();
    } else if (document.getElementById("partyPlaylist")) {
        loadPartyPlaylist();
    } else if (document.getElementById("chillPlaylist")) {
        loadChillPlaylist();
    } else if (document.getElementById("workoutPlaylist")) {
        loadWorkoutPlaylist();
    }
});

// KNAP FUNKTIONER TIL DE FORSKELLIGE PLAYLISTER 
function goToHappy() {
    window.location.href = "happyPlaylist.html"
}

function goToSad(){
    window.location.href = "sadPlaylist.html"
}

function goToParty(){
    window.location.href = "partyPlaylist.html"
}

function goToWorkout(){
    window.location.href = "workoutPlaylist.html"
}

function goToChill(){
    window.location.href = "chillPlaylist.html"
}

function goToMood(){
    window.location.href = "setupMood.html"
}

// denne if statement henter localstorage username, og indsætter velkommen teksten i categories siden
const username = localStorage.getItem("username");

if (username) {
    
    document.getElementById("welcomeText").textContent = "Velkommen, " + username + "!";
}

// FUNKTION TIL BRUGERNAVN - BLIVER HUSKET PÅ NÆSTE SIDE 
document.getElementById("userButton").addEventListener("click", (event) => {
    event.preventDefault(); // stopper form submit

    const username = document.getElementById("email").value;
    if (!username) {
        alert("Indtast et brugernavn!");
        return;
    }

    localStorage.setItem("username", username);
    window.location.href = "categories.html";
});