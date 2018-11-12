export enum ActionType {
	JoinGame,
	NewPosition,
	Goal,
	Winner,
	UpdateScores,
    Collision
}

export default interface Action {
	type: ActionType;
	values: Join | Move | UserEvent | Scores;
}

export interface Join {
	userId: string;
	socketId: string;
}

export interface UserEvent {
	userId: string;
}

export interface Scores {
	players: PlayerScores[];
}

export interface PlayerScores {
	userId: string;
	currentScore: number;
	currentMultipliers: number;
	currentGoals: number;
}

export interface Move {
	objectId: string;
	x: number;
	y: number;
	z: number;
}