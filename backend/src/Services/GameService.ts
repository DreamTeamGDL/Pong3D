
import Game from "../Models/Game";
import GameStats from "../Models/GameStats";
import GameRepository from "../Repositories/GameRepository";
import GameArea from "../Models/GameArea";

export default class GameService {

    private gameRepository: GameRepository;

   public constructor() {
       this.gameRepository = new GameRepository();
   }

   public async createGame(gameId: string, player1: string, player2: string) {
        let game: Game = {
            id: gameId,
            player1: this.initStats(player1),
            player2: this.initStats(player2),
            gameArea: new GameArea(gameId)
        };
        await this.gameRepository.createGame(game);
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