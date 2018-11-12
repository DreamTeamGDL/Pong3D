import IGameObject from "./IGameObject";
import {Vector3} from "math3d";
import GameObject from "./GameObject";
import socketService from "../Services/SocketService";
import {ActionType, Move} from "./Action";
import {clearInterval, setInterval} from "timers";

export default class GameArea {

	private readonly xBound: [Number, Number] = [-1, 1];
	private readonly yBound: [Number, Number] = [-1, 1];
	private readonly zBound: [Number, Number] = [-2, 2];

	private readonly roomId: string;
	private readonly player1: IGameObject;
	private readonly player2: IGameObject;
	private ball: IGameObject;
	private timer: NodeJS.Timer | null = null;


	public constructor(uuid: string) {
		this.player1 = new GameObject("Player1", new Vector3(0, 0, -2));
		this.player2 = new GameObject("Player2", new Vector3(0, 0, 2));
		this.ball = new GameObject("ball", Vector3.zero, this.randomDirection(), 0.10);
		this.roomId = uuid;
	}

	public moveObject(objectId: string, position: Vector3) {
		let finalPos: Move;
		switch(objectId) {
			case "Player1":
				finalPos = this.translateObject(this.player1, position);
				break;
			case "Player2":
				finalPos = this.translateObject(this.player2, position);
				break;
			default:
				throw new Error(`Object does not exist: ${objectId}`);
		}
        socketService.sendAction(this.roomId,{
            type: ActionType.NewPosition,
            values: finalPos
        });
	}

	public get Started() {
		return this.timer != null;
	}

	public set Started(value: boolean) {
		if (!this.Started) {
			this.timer = setInterval(this.ballMove.bind(this), 1000/60);
		} else {
			clearInterval(this.timer!);
			this.timer = null;
		}
	}

	private ballMove() {
		this.ball.updatePosition();
		this.bounce(this.ball.position);
		socketService.sendAction(this.roomId, {
			type: ActionType.NewPosition,
			values: {
				objectId: this.ball.id,
				x: this.ball.position.x,
				y: this.ball.position.y,
				z: this.ball.position.z
			}
		});
	}

	private translateObject(obj: GameObject, translation: Vector3): Move {
		obj.position = obj.position.add(translation);
		return {
			objectId: obj.id,
			x: obj.position.x,
			y: obj.position.y,
			z: obj.position.z
		};
	}

	private bounce(position: Vector3) {
		const x = this.outOfBounds(position.x, this.xBound) ? -this.ball.direction.x : this.ball.direction.x;
		const y = this.outOfBounds(position.y, this.yBound) ? -this.ball.direction.y : this.ball.direction.y;
		const z = this.outOfBounds(position.z, this.zBound) ? -this.ball.direction.z : this.ball.direction.z;
		this.ball.direction = new Vector3(x, y, z);
	}

	private outOfBounds(coord: number, bounds: [Number, Number]): boolean {
		return (coord <= bounds[0] || coord >= bounds[1]);
	}

	private randomDirection(): Vector3 {
		const x = Math.random();
		const y = Math.random();
		const z = Math.random();
		const randomVector = new Vector3(x, y, z);
		console.log(randomVector.values);
		return randomVector.mulScalar(1  / randomVector.magnitude);
	}



}