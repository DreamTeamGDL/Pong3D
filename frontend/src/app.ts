import GameRequester from "./services/GameRequester";

document.addEventListener("DOMContentLoaded", () => {
    (document.getElementById("button") as HTMLButtonElement).onclick = main;
    console.log("ready");
});

function main(){
    let username = (document.getElementById("nicknameTxt") as HTMLInputElement).value;
    let requester = new GameRequester();
    requester.start(username);
    
    setTimeout(() => {
        console.log("Hello");
    }, 5000000);
}