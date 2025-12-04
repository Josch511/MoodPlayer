// gør at den først loader content når hele html siden er loaded først 
document.addEventListener("DOMContentLoaded", () => {
    // henter data fra happyPlaylist.csv
    fetch("/api/happyPlaylist")
    // skriver csv filen om til json 
        .then(res => res.json())
        // giver så den ny formaterede data i et array 
        .then(data => {
            // finder html elementet der har id happyPlaylist 
            const container = document.getElementById("happyPlaylist");
            // laver et loop over alle sange 
            data.forEach(song => {
                // opretter et nyt div element OBS vi bruger det ikke ENDNU 
                const div = document.createElement("div");
                // sætter css class på sangen - også her du skal rette dummy til den rigtige class du vil style med 
                div.className = "dummy";
                // DOM-manipulation (indsætter vores data i den div vi lige har lavet i HTML)
                div.innerHTML = `
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                    <div class="song-duration">${song.duration}</div>
                `;
                // tilføjer vores samlede DOM til HTML dokumentet
                container.appendChild(div);
            });
        });
});
