import IGameObject from "./IGameObject";
import {Vector3} from "math3d";

export default class GameObject implements IGameObject {

	public id: string;
	public position: Vector3;
	public direction: Vector3;
	public speed: number;

	public constructor(
		id: string,
		position: Vector3,
		direction: Vector3 = Vector3.zero,
		speed: number = 0
	) {
		this.id = id;
		this.position = position;
		this.direction = direction;
		this.speed = speed;
	}

	public updatePosition() {
		const velocity = this.direction.mulScalar(this.speed);
		this.position = this.position.add(velocity);
	}

}