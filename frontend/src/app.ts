import GameRequester from "./services/GameRequester";
import Scene from "./webgl/scene";

document.addEventListener("DOMContentLoaded", () => {
    (document.getElementById("startButton") as HTMLButtonElement).addEventListener("click", () => main());
});

function main(){
    const scene = new Scene("canvas", false);
    scene.launch();


    let inputBox = (document.getElementById("inputBox") as HTMLElement);
    let scoreBoard = (document.getElementById("scoreBoard") as HTMLElement);
    let username = (document.getElementById("username") as HTMLInputElement).value;
    let requester = new GameRequester();
    
    requester.start(username, scene);
    inputBox.style.display = "none";
    scoreBoard.style.display = "block";
}