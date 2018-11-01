import GameObject from "./GameObject";
import {Vector3} from "math3d";

export default class GameArea {

	private readonly xBound: [Number, Number] = [-1, -1];
	private readonly yBound: [Number, Number] = [-1, -1];
	private readonly zBound: [Number, Number] = [-2, -2];

	private player1: GameObject;
	private player2: GameObject;
	private ball: GameObject;

	public constructor() {
		this.player1 = {
			id: "Player1",
			position: new Vector3(0, 0, -2)
		};
		this.player2 = {
			id: "Player2",
			position: new Vector3(0, 0, 2)
		};
		this.ball =  {
			id: "ball",
			position: new Vector3(0, 0, 0)
		};
	}

	private ballMove() {

	}

	private randomDirection(): Vector3 {
		const x = Math.random();
		const y = Math.random();
		const z = Math.random();
		const randomVector = new Vector3(x, y, z)
		return randomVector.mulScalar(1  / randomVector.magnitude)
	}



}