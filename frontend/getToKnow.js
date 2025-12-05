// spørgsmål + svarmuligheder 
const questions = [
    {
        title: "Hvilken genre foretrækker du?",
        answers: [
            { emoji: "🎵", text: "Pop 🎵" },
            { emoji: "🎤", text: "Rap 🎤" },
            { emoji: "🎸", text: "Rock 🎸" },
            { emoji: "🎷", text: "Jazz 🎷" }
        ]
    },
    {
        title: "Hvilket sprog lytter du mest til?",
        answers: [
            { emoji: "", text: "Dansk" },
            { emoji: "", text: "Engelsk" },
            { emoji: "", text: "Spansk" },
            { emoji: " ", text: "Fransk" }
        ]
    },
    {
        title: "Hvornår lytter du mest til musik?",
        answers: [
            { emoji: "🏠", text: "Derhjemme 🏠" },
            { emoji: "🏋🏽‍♀️", text: "Træning 🏋🏽‍♀️" },
            { emoji: "🚙", text: "Kørsel 🚙" },
            { emoji: "🎊", text: "Fest 🎊" }
        ]
    },
    {
        title: "Hvilke artister hører du mest?",
        answers: [
            { emoji: "", text: "Drake" },
            { emoji: "", text: "Taylor Swift" },
            { emoji: "", text: "Blackpink" },
            { emoji: "", text: "The Beatles" }
        ]
    }
];

// starter på 1. spørgsmål og gemmer svar i et tomt array
let currentQuestionIndex = 0;
let userAnswers = [];

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
    
        window.location.href = "categories.html";
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

// Spørgsmål kommer frem med det samme af sig selv 
document.addEventListener("DOMContentLoaded", renderQuestion);
