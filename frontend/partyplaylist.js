async function loadPartyPlaylist() {
  const res = await fetch("/api/partyPlaylist");
  const partyPlaylist = await res.json();

  const tbody = document.getElementById("partyPlaylist");

  partyPlaylist.forEach(partyPlaylist => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td></td>
        <td>${partyPlaylist.title}</td>
        <td>${partyPlaylist.album}</td>
        <td>${partyPlaylist.duration}</td>
    `;

    tbody.appendChild(row);
  });
}

loadPartyPlaylist();
