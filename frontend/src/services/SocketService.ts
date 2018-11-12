import { connect } from "socket.io-client";
import { ActionType, Move, UserEvent, Join, PlayerScores, Scores } from "../models/Action";
import Action from "../models/Action";
import MessageType from "../models/Enums";

export default class SocketService {
    private socket: SocketIOClient.Socket;
    private scene: IMutableScene | null;
    private gameId: string = "";
    private userId: string = "";
    
    constructor(url:string, scene: IMutableScene | null) {
        this.socket = connect(url);
        this.socket.on("connect", (socket: SocketIOClient.Socket) => {
           console.log(this.socket.id) ;
        });
        this.scene = scene;

        this.socket.on("action", (rawMessage: string) =>  {
            try {
                const action = JSON.parse(rawMessage) as Action;
                this.processMessage(action);
            } catch (e) {
                console.error(`Message: ${rawMessage}`);
                console.error("Error in parsing JSON: " + e.message);
            }
        });
    }

    public sendMessage(message: Action){
        this.socket.emit("action", message);
    }

    public sendBasicMessage(message: string){
        this.socket.emit("action", message);
    }

    public sendJoinGame(message: Action){
        this.socket.emit("action", message);
    }

    public sendMoveObject(x: number, y: number){
        console.log(this.userId);
        let action: Action = { 
            type: ActionType.NewPosition, 
            values: {
                objectId: this.userId,
                x: x,
                y: y,
                z: 0
            }
        };
        this.socket.emit("action", JSON.stringify(action));
    }

    private processMessage(data: Action){
        let messageId = data.type;
        switch (messageId) {
            case ActionType.NewPosition:
                this.moveObjectMessage(data.values as Move);
                break;
            case ActionType.Winner:
                if(this.scene != null){
                    let winner = data.values as UserEvent;
                    this.scene.showWinner(winner.userId);
                }
                break;
            case ActionType.JoinGame:
                let message = data.values as Join;
                if (message.socketId === this.socket.id) {
                    console.log(message);
                    this.userId = message.userId;
                    if (this.scene != null) {
                        console.log(this.userId);
                        this.scene.setCameraOrien(this.userId == "Player1");
                    }
                }
            case ActionType.Goal:
                if(this.scene != null){
                    let goal = data.values as UserEvent;
                    this.scene.showGoal(goal.userId);
                }
                break;
            case ActionType.UpdateScores:
                let scores = data.values as Scores;
                let myUser = scores.players.find(player => player.userId === this.userId);
                if(myUser != undefined){
                    this.updateScores(myUser);
                } else {
                    console.error("SHIT HAPPENED (Fuck Chris).");
                }
                break;
        }
    }

    private updateScores(player: PlayerScores){
        if(this.scene != null){
            this.scene.updateCounts(player.currentScore, player.currentMultipliers, player.currentGoals);
        }
    }

    private moveObjectMessage(data: Move){
        let position = [data.x, data.y, data.z];
        if (this.scene != null) {
            this.scene.moveObject(data.objectId, position);
        }
    }
}