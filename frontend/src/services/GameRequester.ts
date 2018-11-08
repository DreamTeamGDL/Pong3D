import SocketService from "./SocketService";

export default class GameRequester {
    public start(username: string){
        let request = new XMLHttpRequest();
        request.addEventListener("readystatechange", (event) => {
            if(request.readyState == 4 && request.status == 200){
                let response = JSON.parse(request.response);
                let socket = new SocketService("http://192.168.1.74:3000/"+response.uuid, null);
                //setInterval(() => socket.sendBasicMessage("Hello"), 500);
            }
        });
        request.open("GET", "http://192.168.1.74:3000/"+username);
        request.send();
    }
}