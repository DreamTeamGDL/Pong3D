import GameRequester from "./services/GameRequester";

document.addEventListener("DOMContentLoaded", () => {
	(document.getElementById("button") as HTMLButtonElement).onclick = main;
	console.log("ready");
});

function main(){
	setTimeout(() => {
		console.log("Hello");
	}, 500);

    let username = (document.getElementById("nicknameTxt") as HTMLInputElement).value;
    let requester = new GameRequester();
    requester.start(username);
}