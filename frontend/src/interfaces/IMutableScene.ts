interface IMutableScene {
    moveObject(id: string, position: number[]): void;

    showWinner(winnerUsername: string): void;

    showGoal(scoredBy: string): void;

    updateCounts(score: number, multiplier: number, goals: number, userid: string): void;
}