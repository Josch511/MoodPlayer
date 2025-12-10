// function til at gå hen til de forskellige playlister
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
    document.getElementById("welcomeText").textContent = "Velkommen, " + username + "!" + " Vælg en kategori du gerne vil høre";
}
