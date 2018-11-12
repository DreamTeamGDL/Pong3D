interface IMutableScene {
    moveObject(id: string, position: number[]): void;

    showWinner(winnerUsername: string): void;

    showGoal(scoredBy: string): void;

    updateCounts(scores: number, multipliers: number, goals: number, userid: string): void;

    setCameraOrien(fromFront: boolean): void;
}