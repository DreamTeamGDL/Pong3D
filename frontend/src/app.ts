import GameRequester from "./services/GameRequester";

function main(){
    let username = (document.getElementById("nicknameTxt") as HTMLInputElement).value;
    let requester = new GameRequester();
    requester.start(username);
    
    setTimeout(() => {
        console.log("Hello");
    }, 5000000);
}