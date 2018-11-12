import Game from "../Models/Game";
import GameStats from "../Models/GameStats";
import GameRepository from "../Repositories/GameRepository";
import GameArea from "../Models/GameArea";
import socketService from "./SocketService";
import {Vector3} from "math3d";

class GameService {

	public static instance: GameService = new GameService();
	private gameRepository: GameRepository;
	private games: Game[] = [];

	private constructor() {
		this.gameRepository = new GameRepository();
	}

	public async createGame(gameId: string, player1: string, player2: string) {
		this.games.push({
			id: gameId,
			player1: this.initStats(player1),
			player2: this.initStats(player2),
			gameArea: new GameArea(gameId),
			connected: 0
		});
		socketService.setupChatroom(gameId, () => {
			const game = this.games.find(game => game.id == gameId)!;
			const name = game.connected == 0 ?  "Player1" : "Player2";
			game.connected++;
			return name;
		});
		return Promise.resolve();
		//await this.gameRepository.createGame(game);
	}

	public startGame(gameId: string) {
		const result = this.games.filter(g => g.id == gameId);
		if (result.length != 1) throw new Error("Game is not unique");
		const gameArea = result[0].gameArea;
		if (!gameArea.Started) gameArea.Started = true;
	}

	public moveObject(gameId: string, objectId: string, position: Vector3) {
		const game = this.games.find(g => g.id == gameId)!;
		game.gameArea.moveObject(objectId, position);
	}

	public async scoreGoal(gameId: string, player: string) {
		const game = await this.gameRepository.getGame(gameId);
		if (game.player1.username == player) game.player1 = this.increaseGoals(game.player1);
		else game.player2 = this.increaseGoals(game.player2);
		await this.gameRepository.updateGame(game);
	}

	private increaseGoals(stats: GameStats): GameStats {
		stats.goals++;
		stats.score += 100;
		return stats;
	}

	private initStats(player: string): GameStats {
		return {
			username: player,
			score: 0,
			goals: 0
		}
	}

}

export default GameService.instance;