async function searchSong(query) {
    try {
        // Sender query til backend som der henter sangen
        const res = await fetch(`/search?song=${encodeURIComponent(query)}`);
        const data = await res.json();

        // Tøm resultater
        resultEl.innerHTML = '';
        // data.found siger om der er blevet fundet sange. data.tracks.length tjekker at arrayet har mindst et element (Begge skal være true)
        if (data.found && data.tracks.length > 0) {
            // Viser alle matches som vi har valgt at begrænse den til
            const matches = data.tracks.slice(0, 15);
            matches.forEach(track => {
                const p = document.createElement('p');
                p.textContent = `"${track.title}" af ${track.artist} fra albummet "${track.albumTitle}"`;
                // vi tilføjer <p>-elementet til #result containeren i HTML’en, så det vises på siden.
                resultEl.appendChild(p);
            });
        } else {
            resultEl.textContent = 'Vi kunne desværre ikke finde en sang der matchede din søgning, prøv igen.'
        }

    } catch (error) {
        console.error(error);
        resultEl.textContent = 'Der opstod en fejl, prøv igen';
    }
}
