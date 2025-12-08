// funktion til at gå tilbage til forrige side
function goToHappy() {
    window.location.href = "happyPlaylist.html"
}

function goToSad(){
    window.location.href = "sadPlaylist.html"
}

function goToParty(){
    window.location.href = "workoutPlaylist.html"
}

function goToWorkoutPlaylist(){
    window.location.href = "workoutPlaylist.html"
}
function goToChill(){
    window.location.href = "chillPlaylist.html"
}
function goToMood(){
    window.location.href = "setupMood.html"
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("MoodPlayer category page loaded");

    const cards = document.querySelectorAll(".category-card");
    const footerTitle = document.querySelector(".footer-title");
    const footerArtist = document.querySelector(".footer-artist");

    let selectedCategory = null;
    let currentSong = null;
    let isPlaying = false;

    // test sange for at se om det virker når vi conncter det
    const songs = {
        "Sad": { title: "Lonely Nights", artist: "Tear Drops" },
        "Happy": { title: "Sunny Day", artist: "Good Vibes" },
        "Chill": { title: "Calm Breeze", artist: "DJ Relax" },
        "Party": { title: "Dance All Night", artist: "Club Crew" },
        "Workout": { title: "Power Mode", artist: "Fit Beats" },
        "Mood playlist": { title: "Mixed Emotions", artist: "Shuffle Mix" }
    };

    // vælg kategori som matcher med dummy sangene 
    cards.forEach(card => {
        card.addEventListener("click", () => {
            selectedCategory = card.dataset.category;
            currentSong = songs[selectedCategory]; // Pick first song

            // fjerner highlight fra evt. highlightede kategorier og adder det til den er er valgt
            cards.forEach(c => c.classList.remove("category-card--selected"));
            card.classList.add("category-card--selected");

            // opdater footer med sang info
            footerTitle.textContent = currentSong.title;
            footerArtist.textContent = currentSong.artist;

            isPlaying = false;
            btnPlay.textContent = "▶";
        });
    });

    // UI for brugerne så det kan trykke på knapper og evt handlinger der følger
    const btnLike = document.getElementById("btn-like");
    const btnDislike = document.getElementById("btn-dislike");
    const btnPrev = document.getElementById("btn-prev");
    const btnPlay = document.getElementById("btn-play");
    const btnNext = document.getElementById("btn-next");


    btnPlay.addEventListener("click", () => {
        if (!currentSong) return alert("Vælg en kategori først 🙂");

        isPlaying = !isPlaying;
        btnPlay.textContent = isPlaying ? "⏸" : "▶";

        console.log(`${isPlaying ? "Playing" : "Paused"} ${currentSong.title}`);
    });

    btnPrev.addEventListener("click", () => {
        if (!currentSong) return alert("Vælg en kategori først 🙂");
        console.log("Previous track (Not implemented yet)");
    });

    btnNext.addEventListener("click", () => {
        if (!currentSong) return alert("Vælg en kategori først 🙂");
        console.log("Next track (Not implemented yet)");
    });

    btnLike.addEventListener("click", () => {
        if (!currentSong) return alert("Vælg en kategori først 🙂");
        alert(`Du kunne lide sangen: "${currentSong.title}" 💜`);
    });

    btnDislike.addEventListener("click", () => {
        if (!currentSong) return alert("Vælg en kategori først 🙂");
        alert(`Du kunne IKKE lide sangen: "${currentSong.title}" 😢`);
    });
});


// ændringer kommer senere når vi har dataase osv