import GameRequester from "./services/GameRequester";
import Scene from "./webgl/scene";

document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    (document.getElementById("startButton") as HTMLButtonElement).addEventListener("click", () => main());
});

async function main(){
    const scene = new Scene("canvas", false);
    scene.launch();
=======
	(document.getElementById("button") as HTMLButtonElement).onclick = main;
	console.log("ready");
});

function main(){
	setTimeout(() => {
		console.log("Hello");
	}, 500);
>>>>>>> 6da5202d7a7fd695921b13daea5825383843425f

    let username = (document.getElementById("nicknameTxt") as HTMLInputElement).value;
    let requester = new GameRequester();
    requester.start(username);
<<<<<<< HEAD

    setTimeout(() => {
        console.log("Hello");
    }, 5000000);
=======
>>>>>>> 6da5202d7a7fd695921b13daea5825383843425f
}