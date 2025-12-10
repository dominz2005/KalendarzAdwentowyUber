const normalScreen = document.querySelector(".normalScreen");
const arrowDown = document.querySelector(".arrowDown");
const mainText = document.querySelector(".mainText");

const date = new Date();

if (date.getDate() >= 25) hideEverything();

window.addEventListener("keypress", event => {
    if(!event.ctrlKey) return;
    if(!event.code == "KeyO") return;

    hideEverything();
});

function hideEverything() {
    normalScreen.remove();
    arrowDown.classList.add("opacity-0");
    arrowDown.classList.add("pointer-events-none");
    mainText.innerText = "Dziękujemy i życzymy Szczęśliwego Nowego Roku.";
}