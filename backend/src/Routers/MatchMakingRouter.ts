import {Router} from "express";
import MatchMaker from "../Others/MatchMaker";
import socketService from "../Services/SocketService"
import UserRepository from "../Repositories/UserRepository";
import GameService from "../Services/GameService";

const matchMakingRouter = Router();
const matchmaker = new MatchMaker(60, 250);
const userRepository = new UserRepository();
const gameService = new GameService();

matchMakingRouter.get("/:username", async (req, res) => {
    let username = req.params["username"];
    try {
        console.log("Request arrived");
        let uuid: string = await matchmaker.requestGameId();
        socketService.setupChatroom(uuid);
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