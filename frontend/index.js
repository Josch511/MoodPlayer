// denne function har en localstorage, som gør, at username bliver husket i categories siden i "welcomeText"
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