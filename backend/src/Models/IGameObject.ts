import {Vector3} from "math3d";

export default interface IGameObject {
	id: string;
	position: Vector3;
	direction: Vector3;
	speed: number;
	updatePosition(): void;
}