// funktion til at gå tilbage til forrige side
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

const username = localStorage.getItem("username");

if (username) {
    document.getElementById("welcomeText").textContent = "Velkommen, " + username + "!" + " Vælg en kategori du gerne vil høre";
}
