// Kodning til happyPlaylist.html

// funktion til at gå tilbage til forrige side
function goBack() {
    window.history.back();
}

// gør at den først loader content når hele html siden er loaded først 
document.addEventListener("DOMContentLoaded", () => {
    // henter data fra happyPlaylist.csv
    fetch("/api/happyPlaylist")
    // skriver csv filen om til json 
        .then(res => res.json())
        // giver så den ny formaterede data i et array 
        .then(data => {
            // finder html elementet der har id happyPlaylist 
            const tbody = document.getElementById("happyPlaylist");
            // laver et loop over alle sange 
            data.forEach((song, index) => {
                // opretter en ny tabel OBS vi bruger det ikke ENDNU 
                const tr = document.createElement("tr");
                // vi puutter DOMen i HTML og fortæller hvad den skal vise 
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${song.title}</td>
                    <td>${song.album}</td>
                    <td>${song.duration}</td>
                `;
                // vi sender hele vores DOM til vores html element 
                tbody.appendChild(tr);
            });
        });
});
