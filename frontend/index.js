


addEventListener("DOMContentLoaded", () => {
    let partyCode = establishPartyCode();
    history.replaceState(null, '', partyCode);
    addEventListener('popstate', () => {
        partyCode = establishPartyCode();
    });
    pollForCurrentTrackAt(partyCode);
});

// Extract party code from browser's address field
// or make one up, if it doesn't have one
function establishPartyCode() {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/') && pathname.length > 1) {
        return pathname.substring(1);
    } else {
        return crypto.randomUUID().substring(0, 4);
    }
}

// Start polling loop, repeated asking server for the current track
async function pollForCurrentTrackAt(partyCode) {
    const path = `/api/party/${partyCode}/currentTrack`;
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`GET ${path} failed with ${response.status} ${response.statusText}`)
    }
    const track = await response.json();
    renderCurrentTrack(partyCode, track);
    setTimeout(() => pollForCurrentTrackAt(partyCode), 1000); // refresh every 1000ms
}

// update HTML to reflect party ID and current track
function renderCurrentTrack(partyId, track) {
    const contentDiv = document.getElementById('content');
    contentDiv.textContent = `Party ${partyId} is now listening to ${track.title} by ${track.artist}`
}
/*      VERSION 1 
// får opret bruger knappen til at gå videre til getToKnow.html

// når man trykker på opret konto knappen 
document.getElementById("opretkontoknap").addEventListener("click", () => {

    // opretter email og password og tager dem inde fra html 
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // tjekker om email og password er udfyldt 
    if (email == "" || password == "") {
        // ellers alert med denne besked:
        alert("Udfyld venligst email og adgangskode, prøv igen");
        return;
    }

    // hvis begge felter er udfyldt svarer den med getToKnow.html 
    window.location.href = "getToKnow.html"

});
*/

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