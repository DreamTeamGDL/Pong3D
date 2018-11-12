
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
	values: Join | Move;
}

export interface Join {
	userId: string;
}

export interface Move {
	objectId: string;
	x: number;
	y: number;
	z: number;
}