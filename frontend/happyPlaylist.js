// Kodning til happyPlaylist.html

// funktion til at gå tilbage til forrige side
function goBack() {
    window.history.back();
}


document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/happyPlaylist")

        .then(res => res.json())

        .then(data => {

            const tbody = document.getElementById("happyPlaylist");
            const audio = document.getElementById("audio-player");
            const cover = document.querySelector(".footer-album");
            const titleEl = document.getElementById("song-title");
            const albumEl = document.getElementById("song-artist");

            let playlist = data; 
            let currentIndex = 0;

            // indsætter sange i fra csv i tabellerne
            playlist.forEach((song, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${song.title}</td>
                    <td>${song.album}</td>
                    <td>${song.duration}</td>
                `;

                tbody.appendChild(tr);
            });
            // vælger den næste sang der skal spilles 
            function loadSong(index) {
                currentIndex = index;
                const song = playlist[index];

                titleEl.textContent = song.title;
                albumEl.textContent = song.artist;

                cover.style.backgroundImage = `url("${song.albumCover}")`;
                cover.style.backgroundSize = "cover";
                cover.style.backgroundPosition = "center";

                if (song.audio) {
                    audio.src = song.audio;
                } else {
                    audio.src = "";
                }

            audio.play().catch(() => {});

            }

              audio.addEventListener("ended", () => {
                currentIndex = (currentIndex + 1) % playlist.length;
                loadSong(currentIndex);
            });
        });
});
