import {Router} from "express";
import MatchMaker from "../Others/MatchMaker";
import io from "./SocketRouter"
import UserRepository from "../Repositories/UserRepository";
import GameService from "../Services/GameService";

const matchMakingRouter = Router();
const matchmaker = new MatchMaker(60, 250);
const userRepository = new UserRepository();
const gameService = new GameService();

async function setupChatroom(uuid: string): Promise<void> {
    let namespace = io.of(`/${uuid}`) // Creating chat namespace
    namespace.removeAllListeners();
    namespace.on("connect", (socket: SocketIO.Socket) => {
        socket.removeAllListeners(); // Prevents duplicates
        socket.on("action", (msg: string) => {
            console.log("Message: " + msg);
            socket.emit(msg);
        });
    });
}

matchMakingRouter.get("/:username", async (req, res) => {
    let username = req.params["username"];
    try {
        console.log("Request arrived");
        let uuid: string = await matchmaker.requestGameId();
        setupChatroom(uuid);
        res.statusCode = 200;
        let json = {"uuid": uuid};
        res.end(JSON.stringify(json));
    } catch (e) {
        let error = e as Error;
        switch(error.message) {
        case "No partner found":
            res.statusCode = 404;
            break;
        default:
            res.statusCode = 401;
        }
        res.end(error.message);
    }
});

export default matchMakingRouter;