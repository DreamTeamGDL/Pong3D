import { connect } from "socket.io-client";
import IMessage from "../models/IMessage";
import MessageType from "../models/Enums";

export default class SocketService {
    private socket: SocketIOClient.Socket;
    private scene: IMutableScene | null;
    private gameId: string = "";
    
    constructor(url:string, scene: IMutableScene | null) {
        this.socket = connect(url);
        this.scene = scene;

        this.socket.on("data", this.processMessage);
    }

    public sendMessage(message: IMessage){
        this.socket.emit("newPosition", message);
    }

    public sendBasicMessage(message: string){
        this.socket.emit("action", message);
    }

    private processMessage(data: IMessage){
        let messageId = data.messageId;
        switch (messageId) {
            case MessageType.NewPosition:
                this.moveObjectMessage(data);
                break;
            case MessageType.JoinGame:
                this.gameRoomAssigned(data);
                break;
            case MessageType.Winner:
                if(this.scene != null){
                    this.scene.showWinner(data.winnerUsername!);
                }
                break;
            case MessageType.Goal:
                if(this.scene != null){
                    this.scene.showGoal(data.scoredBy!);
                }
                break;
            case MessageType.UpdateScores:
                if(this.scene != null){
                    this.scene.updateCounts(data.currentScore!, data.currentMultipliers!, data.currentGoals!);
                }
                break;
        }
    }

    private gameRoomAssigned(data: IMessage){
        this.gameId = data.uuid!;
        console.log("Redirecting");
    }

    private moveObjectMessage(data: IMessage){
        let position = [data.x!, data.y!, data.z!];
        console.log(position);
        if(this.scene != null){
            this.scene.moveObject(data.objectId!, position);
        }
    }
}