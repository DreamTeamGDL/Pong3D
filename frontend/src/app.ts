import GameRequester from "./services/GameRequester";
import Scene from "./webgl/scene";

document.addEventListener("DOMContentLoaded", () => {
    (document.getElementById("startButton") as HTMLButtonElement).addEventListener("click", () => main());
});

async function main(){
    const scene = new Scene("canvas", false);
    scene.launch();
    let username = (document.getElementById("nicknameTxt") as HTMLInputElement).value;
    let requester = new GameRequester();
    requester.start(username, scene);
}