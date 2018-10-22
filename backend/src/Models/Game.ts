import GameStats from "./GameStats";

export default interface Game {
    id: string;
    player1: GameStats;
    player2: GameStats;
}