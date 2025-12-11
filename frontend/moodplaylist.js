// Henter matchedsongs fra sessionstorage fra setupMood.js
const data = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
console.log("Matched songs on mood page:", data);
// Format duration from ms to mm:ss
function formatDuration(ms = 0) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
// Load matched playlist into table
async function loadMatchedPlaylist() {
    const tbody = document.getElementById("moodplaylist");
    if (!tbody) return;

    const playlist = JSON.parse(sessionStorage.getItem("matchedSongs") || "[]");
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

loadMatchedPlaylist();