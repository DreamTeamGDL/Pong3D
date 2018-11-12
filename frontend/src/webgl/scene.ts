import { GLScene, GLVector, Point4D, Triangle, Rectangle, AbstractPolygon, Square, IDrawable, GLCamera } from "smartgl";
import {mat4} from "gl-matrix";
import SocketService from "../services/SocketService";

export default class Scene extends GLScene implements IMutableScene {

	public socketService: SocketService | null = null;
    private player1 = new Rectangle(this.gl, new Point4D(-0.5, 0, 2), 0.3);
	private player2 = new Rectangle(this.gl, new Point4D(0.5, 0,-2), 0.3);
	private ball = new Rectangle(this.gl, new Point4D(0, 0, 0), 0.3);

	private static readonly PINK_PONG = new Point4D(255/255, 13/255, 214/255, 1);
	private static readonly BLUE_PONG = new Point4D(18/255, 154/255, 255/255, 1);

	private gameObjects: Map<string, IDrawable> = new Map();
	
	public constructor(canvasId: string, animate: boolean) {
		super(canvasId, animate);
		this.player1.setColor(Scene.PINK_PONG);
		this.player2.setColor(Scene.BLUE_PONG);
		this.ball.setColor(Point4D.Green);
		this.onInit();
	}

	protected onInit() {
        this.drawables.push(this.player2, this.ball, this.player1);
        this.drawables.push(
        	new Square(this.gl, new Point4D(1, 1, 2), 0.1),
        	new Square(this.gl, new Point4D(1, 1, -2), 0.1),
        	new Square(this.gl, new Point4D(1, -1, 2), 0.1),
        	new Square(this.gl, new Point4D(1, -1, -2), 0.1),
        	new Square(this.gl, new Point4D(-1, 1, 2), 0.1),
        	new Square(this.gl, new Point4D(-1, 1, -2), 0.1),
        	new Square(this.gl, new Point4D(-1, -1, 2), 0.1),
        	new Square(this.gl, new Point4D(-1, -1, -2), 0.1),
		);
        this.gameObjects.set("Player1", this.player1);
        this.gameObjects.set("Player2", this.player2);
        this.gameObjects.set("ball", this.ball);
        document.addEventListener("keydown", this.movePlayer.bind(this));
	}

	protected uniformBindings(vector: GLVector) {
		const pointSize = this.gl.getUniformLocation(vector.program, "uPointSize");
		const uTransform = this.gl.getUniformLocation(vector.program, "uTransformMatrix");
		this.gl.uniform1f(pointSize, 5);
		const transformMatrix = this.transform();
		this.gl.uniformMatrix4fv(uTransform, false, transformMatrix);
	}

	private createWireframes() {
		
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
				this.sendMove(0, 0.2);
                //this.player1.translate(0, 0.2);
                break;
			case "ArrowDown":
				this.sendMove(0, -0.2);
                //this.player1.translate(0, -0.2);
				break;
			case "ArrowLeft":
				this.sendMove(-0.1, 0);
				//this.player1.translate(-0.1, 0);
				break;
			case "ArrowRight":
				this.sendMove(0.1, 0);
				//this.player1.translate(0.1, 0);
            default:
                break;
		}
        this.nextFrame();
	}
	
	private sendMove(x: number, y: number){
		if(this.socketService == null)
			return;
		this.socketService.sendMoveObject(x, y);
	}

	private transform(): Float32Array {
		const aspectRatio = this.canvas.height / this.canvas.width;
		const camera = new GLCamera(5, aspectRatio);
		return camera.observe();
	}

	private toClipping(point: Point4D, rect: ClientRect): Point4D {
		const x = 2 * (point.x - rect.left) / this.canvas.width - 1;
		const y = 2 * (rect.top - point.y) / this.canvas.height + 1;
		return new Point4D(x, y);
	}

	moveObject(id: string, position: number[]): void {
		const obj = this.gameObjects.has(id) ? this.gameObjects.get(id)! : null;
		if (obj == null) throw new Error(`Gameobj not found: ${id}`);
		const [x, y, z] = position;
		obj.translate(x, y);
		this.nextFrame();
	}
	showWinner(winnerUsername: string): void {
		throw new Error("Method not implemented.");
	}
	showGoal(scoredBy: string): void {
		throw new Error("Method not implemented.");
	}
	updateCounts(scores: number, multipliers: number, goals: number): void {
		throw new Error("Method not implemented.");
	}
}