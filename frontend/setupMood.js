// spørgsmål + svarmuligheder 
const questions = [
    {
        title: "Hvilke følelser har du lige nu?",
        answers: [
            { text: "Rolig" },
            { text: "Vred" },
            { text: "Forelsket" },
            { text: "Heartbroken" }
        ]
    },
    {
        title: "Hvilket energiniveau passer bedst til hvordan du har det lige nu?",
        answers: [
            { text: "Lav" },
            { text: "Medium" },
            { text: "Høj" },
        ]
    },
    {
        title: "Hvilken stemning foretækker du?",
        answers: [
            { text: "Mørk" },
            { text: "Lys" },
            { text: "Blandet" }
        ]
    },
    {
        title: "Hvor meget har du lyst til at danse til musikken?",
        answers: [
            { text: "Overhovedet ikke" },
            { text: "Sådan nogenlunde" },
            { text: "Ja meget" }
        ]
    },
];

// starter på 1. spørgsmål og gemmer svar i et tomt array
let currentQuestionIndex = 0;
let userAnswers = [];
console.log(userAnswers);

// henter elementerne fra HTML 
const titleEl = document.getElementById("question-title");
const answersEl = document.getElementById("answers");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");

// viser det gældne spørgsmål på siden 
function renderQuestion() {
    // henter det spørgsmål der matcher currentQuestionIndex
    const question = questions[currentQuestionIndex];

    // sætter overskriften i HTML til spørgsmålets tekst
    titleEl.textContent = question.title;

    // fjerner tidligere svar-knapper, så vi kan vise de nye
    answersEl.innerHTML = "";

    // deaktiverer fortsætknappen indtil der er valgt et svar
    nextBtn.disabled = true;

    // looper over svarmulighederne til det gældne spørgsmål
    question.answers.forEach((answer) => {
        // opretter en knap til hvert svar
        const btn = document.createElement("button");

        // giver knappen CSS-klassen answer-btn
        btn.classList.add("answer-btn");

        // gør så svarmulighederne er det der står på knapperne
        btn.textContent = answer.text;

        // laver klik funktion på selve svarmuligheds knappen
        btn.addEventListener("click", () => {

            // fjern "active" fra ALLE knapper, så kun én kan blive valgt
            document.querySelectorAll(".answer-btn")
                .forEach(b => b.classList.remove("active"));

            // markere det klikkede svar
            btn.classList.add("active");

            // gemmer svaret i userAnswers array 
            userAnswers[currentQuestionIndex] = answer.text;

            // aktiverer fortsæt knappen
            nextBtn.disabled = false;
        });

        // Tilføj knappen til svar-containeren på html siden
        answersEl.appendChild(btn);
    });

    // opdatere progress-bar og hvilket nummer i rækken vi er på
    updateProgress();

    // vis eller skjul tilbage-knappen afhængig af om vi er på spørgsmål 0 eller 1
    updateBackButton();
}

// opdaterer progress bar
function updateProgress() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Spørgsmål ${currentQuestionIndex + 1} af ${questions.length}`;
}

// den viser tilbage knappen på spørgsmål 2-5 men ikke ved det første 
function updateBackButton() {
    backBtn.style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
}

// Fortsæt knappens funktion 
nextBtn.addEventListener("click", () => {

    if (!userAnswers[currentQuestionIndex]) return;

    currentQuestionIndex++;

    // hvis det er 5. spørgsmål der er givet svar på alert "du er færdig"
    if (currentQuestionIndex >= questions.length) {
        console.log("Brugerens svar:", userAnswers);

        valence = 0;
        tempo = 0;
        loudness = 0;
        energy = 0;
        acousticness = 0;
        danceability = 0;
        instrumentalness = 0;

        // FØLELSER
        if (userAnswers[0] === "Rolig") {
            valence += 0.4;
        }
        if (userAnswers[0] === "Vred") {
            valence += 0.15;
        }
        if (userAnswers[0] === "Forelsket") {
            valence += 0.6;
            acousticness += 0.5;
        }
        if (userAnswers[0] === "Heartbroken") {
            valence += 0.2;
        }

        // ENERGI
        if (userAnswers[1] === "Lav") {
            tempo += 50;
            energy += 0.4;
        }
        if (userAnswers[1] === "Medium") {
            tempo += 100;
            energy += 0.6;
        }
        if (userAnswers[1] === "Høj") {
            tempo += 130;
            energy += 0.9;
        }

        // STEMNING
        if (userAnswers[2] === "Mørk") {
            instrumentalness += 0.5;
            loudness += -5;
        }
        if (userAnswers[2] === "Lys") {
            instrumentalness += 0.2;
            loudness += -8;
        }
        if (userAnswers[2] === "Blandet") {
            instrumentalness += 0.35;
        }

        // DANS
        if (userAnswers[3] === "Overhovedet ikke") {
            energy += 0.2;
            danceability += 0.4;
        }
        if (userAnswers[3] === "Sådan nogenlunde") {
            energy += 0.5;
            danceability += 0.6;
        }
        if (userAnswers[3] === "Ja meget") {
            energy += 0.8;
            danceability += 0.9;
        }
        // sørger for at værdierne ikke overstiger 1
        if (energy > 1) energy = 1;

        console.log("Valence:", valence);
        console.log("Tempo:", tempo);
        console.log("Loudness:", loudness);
        console.log("Energy:", energy);
        console.log("Acousticness:", acousticness);
        console.log("Danceability:", danceability);
        console.log("Instrumentalness:", instrumentalness);

        // Send audio features to API and get matched songs
        fetch("/api/matchedPlaylist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                valence,
                tempo,
                loudness,
                energy,
                acousticness,
                danceability,
                instrumentalness
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Matched songs:", data);
            window.location.href = "/moodplaylist.html";
        })
        .catch(err => {
            console.error("Error fetching matched playlist:", err);
        });
        return;
    }

    renderQuestion();
});

// Tilbage knappens funktion 
backBtn.addEventListener("click", () => {
    if (currentQuestionIndex === 0) return;

    currentQuestionIndex--;
    renderQuestion();
});

// Render first question on page load
renderQuestion();

async function loadPartyPlaylist() {
    try {
        const res = await fetch("/api/moodplaylist");
        playlist = await res.json();

        // Fyld tabel med sange
        playlist.forEach((song, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.track_name}</td>
                <td>${data.artist}</td>
                <td>${data.album.name}</td>
            `;

            // Klik på rækken for at afspille sangen
            row.addEventListener("click", () => loadSong(index));

            tbody.appendChild(row);
        });

        // Afspil første sang automatisk
        if (playlist.length > 0) {
            loadSong(0);
        }

    } catch (error) {
        console.error("Fejl ved hentning af playlist:", error);
    }
}