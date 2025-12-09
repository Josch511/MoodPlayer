// Load matched songs from sessionStorage and display them
document.addEventListener("DOMContentLoaded", () => {
    const matchedSongsJSON = sessionStorage.getItem("matchedSongs");
    
    if (!matchedSongsJSON) {
        document.getElementById("songsList").innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>Ingen sange fundet. Prøv igen.</p>
            </div>
        `;
        return;
    }

    try {
        const matchedSongs = JSON.parse(matchedSongsJSON);
        
        if (matchedSongs.length === 0) {
            document.getElementById("songsList").innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <p>Ingen sange matcher dine præferencer. Prøv igen.</p>
                </div>
            `;
            return;
        }

        // Display matched songs
        const songsList = document.getElementById("songsList");
        
        matchedSongs.forEach((song, index) => {
            const songRow = document.createElement("div");
            songRow.className = "song-row";
            
            // Format duration from milliseconds to MM:SS
            const durationMs = song.duration_ms || 0;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = ((durationMs % 60000) / 1000).toFixed(0);
            const formattedDuration = `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
            
            songRow.innerHTML = `
                <div class="song-title">${song.track_name || 'Unknown'}</div>
                <div class="song-artist">${song.artists || 'Unknown'}</div>
                <div class="song-duration">${formattedDuration}</div>
            `;
            
            songsList.appendChild(songRow);
        });

        console.log(`Displayed ${matchedSongs.length} matched songs`);
    } catch (err) {
        console.error("Error parsing matched songs:", err);
        document.getElementById("songsList").innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>Der var en fejl ved indlæsning af musikken.</p>
            </div>
        `;
    }
});

// Navigation functions
function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = "/index.html";
}
