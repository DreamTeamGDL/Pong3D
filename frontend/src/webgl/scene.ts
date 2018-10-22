import { GLScene, GLVector, Point4D, Triangle, Rectangle, AbstractPolygon, Square } from "smartgl";
import {mat4} from "gl-matrix";

export default class Scene extends GLScene implements IMutableScene {
	
    private player1 = new Rectangle(this.gl, new Point4D(-0.5,0), 0.3);
	private player2 = new Rectangle(this.gl, new Point4D(0.5,0), 0.3);
	
	public constructor(canvasId: string, animate: boolean) {
		super(canvasId, animate);
		this.onInit();
	}

	protected onInit() {
        this.drawables.push(this.player1, this.player2);
        document.addEventListener("keydown", this.movePlayer.bind(this));
	}

	protected uniformBindings(vector: GLVector) {
		const pointSize = this.gl.getUniformLocation(vector.program, "uPointSize");
		const uTransform = this.gl.getUniformLocation(vector.program, "uTransformMatrix");
		this.gl.uniform1f(pointSize, 5);
		const transformMatrix = this.transform();
		this.gl.uniformMatrix4fv(uTransform, false, transformMatrix);
	}

	private click(e: MouseEvent) {
		const pixelLocation = new Point4D(e.clientX, e.clientY);
		const rectangle = this.canvas.getBoundingClientRect();
		const center = this.toClipping(pixelLocation, rectangle);
		this.nextFrame();
    }
    
    private movePlayer(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowUp":
                this.player1.translate(0, 0.05);
                break;
            case "ArrowDown":
                this.player1.translate(0, -0.05);
                break;
            default:
                break;
        }
        this.nextFrame();
    }

	private transform(): Float32Array {
		const view = mat4.create();
		mat4.lookAt(view, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
		const projection = mat4.create();
		mat4.ortho(projection, -1, 1, -1, 1, 0.1, 1000);
		const result = mat4.create();
		mat4.multiply(result, projection, view);
		return result;
	}

	private toClipping(point: Point4D, rect: ClientRect): Point4D {
		const x = 2 * (point.x - rect.left) / this.canvas.width - 1;
		const y = 2 * (rect.top - point.y) / this.canvas.height + 1;
		return new Point4D(x, y);
	}

	moveObject(id: string, position: number[]): void {
		throw new Error("Method not implemented.");
	}
	showWinner(winnerUsername: string): void {
		throw new Error("Method not implemented.");
	}
	showGoal(scoredBy: string): void {
		throw new Error("Method not implemented.");
	}
	updateCounts(scores: number[], multipliers: number[], goals: number[]): void {
		throw new Error("Method not implemented.");
	}
}