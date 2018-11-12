import GameRequester from "./services/GameRequester";
import Scene from "./webgl/scene";

document.addEventListener("DOMContentLoaded", () => {
    (document.getElementById("startButton") as HTMLButtonElement).addEventListener("click", () => main());
});

function main(){
    const scene = new Scene("canvas", false);

    let inputBox = (document.getElementById("inputBox") as HTMLElement);
    let errorBox = (document.getElementById("errorBox") as HTMLElement);
    let scoreBoard = (document.getElementById("scoreBoard") as HTMLElement);
    let username = (document.getElementById("username") as HTMLInputElement).value;
   
    (document.getElementById("errorButton") as HTMLButtonElement).addEventListener("click", () => { 
        errorBox.style.display = "none";
    });
    
    if (username.length >= 3 && username.length <= 15) {
        inputBox.style.display = "none";
        scoreBoard.style.display = "block";

        scene.launch();
        let requester = new GameRequester();
        requester.start(username, scene);
    }
    else {
        errorBox.style.display = "block";
    }
}