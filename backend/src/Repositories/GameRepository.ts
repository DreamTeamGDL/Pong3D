import Database from "./Database";
import Game from "../Models/Game";

export default class GameRepository {

    public constructor() {
        Database.connect();
    }

    public async createGame(game: Game) {
        const exists = (await Database.exists({id: game.id}, "games"));
        if (exists) throw new Error("Game exists");
        await Database.create(game, "games");
    }

    public async getGame(gameId: string): Promise<Game> {
        const games = await Database.read({id: gameId}, "games");
        if (games.length == 0) throw new Error("Game does not exist");
        return games[0];
    }

    public async updateGame(game: Game) {
        const exists = (await Database.exists({id: game.id}, "games"));
        if (!exists) throw new Error("Game does not exist");
        Database.update({id: game.id}, game, "games");
    }

}