// DOM MANIPULATION 
const toggle = document.querySelector('.dark-toggle');

// localstorage gør så den husker at funktionen er valgt 
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}

// Event når man trykker på 
toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // denne gør at den forbliver i darkmode 
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});