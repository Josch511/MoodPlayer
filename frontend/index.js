// FUNKTION TIL TILBAGEKNAP
function goBack() {
    window.location.href = "index.html";
}

// OPRET 
document.getElementById("userButton").addEventListener("click", (event) => {
    event.preventDefault();
    
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const day = document.getElementById("day");
    const month = document.getElementById("month");
    const year = document.getElementById("year");
    const terms = document.getElementById("terms");

    // Validering
    if (
        username.value.trim() === "" ||
        password.value.trim() === "" ||
        day.value === "" ||
        month.value === "" ||
        year.value === "" ||
        !terms.checked
    ) {
        alert("Udfyld venligst alle felter før du fortsætter");
        return;
    }

    // Gem brugernavn
    localStorage.setItem("username", username.value);

    // Send videre til categories
    window.location.href = "categories.html";
});

