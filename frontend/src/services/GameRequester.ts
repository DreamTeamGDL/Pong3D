import SocketService from "./SocketService";

export default class GameRequester {

    private static readonly BaseUrl = "http://10.0.1.22";
    private static readonly Port = 3000;
    private static get Url() {
        return `${this.BaseUrl}:${this.Port}/`;
    }

    public start(username: string){
        let request = new XMLHttpRequest();
        request.addEventListener("readystatechange", (event) => {
            if(request.readyState == 4 && request.status == 200){
                let response = JSON.parse(request.response);
                let socket = new SocketService(GameRequester.Url + response.uuid, null);
                //setInterval(() => socket.sendBasicMessage("Hello"), 500);
            }
        });
        request.open("GET", GameRequester.Url + username);
        request.send();
    }
}