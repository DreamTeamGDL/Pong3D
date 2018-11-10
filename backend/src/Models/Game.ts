import GameStats from "./GameStats";
import GameArea from "./GameArea";

export default interface Game {
    id: string;
    player1: GameStats;
    player2: GameStats;
    gameArea: GameArea;
    connected: number
}