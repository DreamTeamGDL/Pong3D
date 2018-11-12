import IGameObject from "./IGameObject";
import {Vector3} from "math3d";
import GameObject from "./GameObject";
import socketService from "../Services/SocketService";
import gameService from "../Services/GameService"
import {ActionType, Move} from "./Action";
import {clearInterval, setInterval} from "timers";

export default class GameArea {

	private readonly xBound: [Number, Number] = [-1, 1];
	private readonly yBound: [Number, Number] = [-1, 1];
	private readonly zBound: [Number, Number] = [-2, 2];

	private readonly goalieWidth = 0.4;
	private readonly goalieHeight = 0.4;

	private readonly roomId: string;
	private readonly player1: IGameObject;
	private readonly player2: IGameObject;
	private ball: IGameObject;
	private timer: NodeJS.Timer | null = null;

	private notColliding = false;


	public constructor(uuid: string) {
		this.player1 = new GameObject("Player1", new Vector3(0, 0, 2));
		this.player2 = new GameObject("Player2", new Vector3(0, 0, -2));
		this.ball = new GameObject("ball", Vector3.zero, this.randomDirection(), 0.01);
		this.roomId = uuid;
		setTimeout(() => {
			socketService.sendAction(this.roomId, {
				type: ActionType.Winner,
				values: {}
			});
			clearInterval(this.timer!);
		}, 200000);
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
			this.ball.position = Vector3.zero;
			this.postBall();
			setTimeout(() => this.Started = true, 5000);
			this.timer = null;
		}
	}

	private ballMove() {
		this.ball.updatePosition();
		this.bounce(this.ball.position);
		this.postBall();
		this.detectCollision();
	}

	private postBall() {
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

	private detectCollision() {
		const pos = this.ball.position;
		const threshold = 0.005;
		const dz = 2 - Math.abs(pos.z);
		if (dz < threshold) {
			pos.z > 0 ? this.collide(this.player1) : this.collide(this.player2);
		}
	}

	private collide(goalie: GameObject) {
		if (this.notColliding) return;
		const isCollision = this.isInside(goalie.position, this.ball.position);
		if (!isCollision) {
			console.log(goalie.id + ' received goal');
			gameService.scoreGoal(this.roomId, this.oppositePlayer(goalie.id));
			this.Started = false;
		} else {
			//this.ball.direction = new Vector3(this.ball.direction.x, this.ball.direction.y, -this.ball.direction.z);
			gameService.increaseMult(this.roomId, goalie.id);
			console.log("Increase");
			socketService.sendAction(this.roomId, {
				type: ActionType.Collision,
				values: {}
			});
			gameService.updateScores(this.roomId, false);
			this.notColliding = true;
			setTimeout(() => this.notColliding = false, 1000);
		}
    }

    public isInside(goalie: Vector3, ball: Vector3): boolean {
        const outX = this.outOfBounds(ball.x, [goalie.x - this.goalieWidth / 2, goalie.x + this.goalieWidth / 2]);
        const outY = this.outOfBounds(ball.y, [goalie.y - this.goalieHeight / 2, goalie.y + this.goalieHeight / 2]);
        return !outX && !outY;
    }

    private angle(A: Vector3, B: Vector3) {
		return Math.atan2(B.y - A.y, B.x - A.x);
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
		return randomVector.mulScalar(1  / randomVector.magnitude);
	}

    private round(num: number): number {
        return Number(num.toFixed(4));
    }

    private oppositePlayer(player: string) {
		return player === "Player1" ? "Player2" : "Player1";
	}

}