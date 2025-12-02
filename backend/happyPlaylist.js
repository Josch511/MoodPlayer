// Konverter duration fra millisekunder til mm:ss
function msToMinutes(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Parser CSV -> array af objekter
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    // Splitter kun på kommaer – i dit dataset er det sikkert
    const values = line.split(",");

    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

// Hent CSV og vis tracks
fetch("./tracks.csv")
  .then(res => res.text())
  .then(csv => {
    const tracks = parseCSV(csv);
    displayTracks(tracks);
  })
  .catch(err => console.error("Fejl ved CSV hentning:", err));

// Generér sangbokse
function displayTracks(tracks) {
  const playlistContainer = document.getElementById("playlist");

  tracks.forEach(track => {
    const title = track.track_name;
    const artist = track.artists;
    const duration = msToMinutes(Number(track.duration_ms));

    const trackCard = document.createElement("div");
    trackCard.classList.add("track-card-happy");

    trackCard.innerHTML = `
      <div class="track-info-happy">
        <h3>${title}</h3>
        <p>${artist}</p>
      </div>
      <span class="track-duration-happy">${duration}</span>
    `;

    playlistContainer.appendChild(trackCard);
  });
}