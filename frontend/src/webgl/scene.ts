import { GLScene, GLVector, Point4D, Triangle, Rectangle, AbstractPolygon, Square, IDrawable, GLCamera } from "smartgl";
import SocketService from "../services/SocketService";

export default class Scene extends GLScene implements IMutableScene {

	public socketService: SocketService | null = null;
    private player1 = new Rectangle(this.gl, new Point4D(0,0,2), 0.1);
	private player2 = new Rectangle(this.gl, new Point4D(0,0,-2), 0.1);
	private ball = new Rectangle(this.gl, new Point4D(0,0,0), 0.1);
	private drawablesWire: IDrawable[] = [];

	private static readonly PINK_PONG = new Point4D(255/255, 13/255, 214/255, 1);
	private static readonly BLUE_PONG = new Point4D(18/255, 154/255, 255/255, 1);

	private cameraZ: number = 5;

	private gameObjects: Map<string, IDrawable> = new Map();
	
	public constructor(canvasId: string, animate: boolean) {
		super(canvasId, animate);
		this.player1.setColor(Scene.PINK_PONG);
		this.player2.setColor(Scene.BLUE_PONG);
		this.ball.setColor(Point4D.Green);
		this.onInit();
	}

	protected onInit() {
		let box = this.setBoxWireframes();
		// this.renderingMode = this.gl.LINE_LOOP;
		for (let index = 0; index < box.length; index++) {
			this.drawablesWire.push(box[index]);
		}

		this.setGameElements();
		// this.renderingMode = this.gl.TRIANGLES;
		this.drawables.push(this.player2, this.ball, this.player1);
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

	private setGameElements() {
		// P1 Vertices
		let p11 = new Point4D(-0.2, 0.2, 2);
		let p12 = new Point4D(0.2, 0.2, 2);
		let p13 = new Point4D(-0.2, -0.2, 2);
		let p14 = new Point4D(0.2, -0.2, 2);
		let p1Vertices = [];
		p1Vertices.push(p11, p12, p14, p13);
		this.player1.setPoints(p1Vertices);

		// P2 Vertices
		let p21 = new Point4D(-0.2, 0.2, -2);
		let p22 = new Point4D(0.2, 0.2, -2);
		let p23 = new Point4D(-0.2, -0.2, -2);
		let p24 = new Point4D(0.2, -0.2, -2);
		let p2Vertices = [];
		p2Vertices.push(p21, p22, p24, p23);
		this.player2.setPoints(p2Vertices);

		// Ball Vertices
		let b1 = new Point4D(-0.1, 0.2, 0);
		let b2 = new Point4D(0.1, 0.2, 0);
		let b3 = new Point4D(-0.1, -0.2, 0);
		let b4 = new Point4D(0.1, -0.2, 0);
		let bVertices = [];
		bVertices.push(b1, b2, b4, b3);
		this.ball.setPoints(bVertices);
		this.nextFrame();
	}

	private setBoxWireframes(): Rectangle[] {
		// P1 View
		let p11 = new Point4D(-1, 1, 2);
		let p12 = new Point4D(1, 1, 2);
		let p13 = new Point4D(-1, -1, 2);
		let p14 = new Point4D(1, -1, 2);

		// P2 View
		let p21 = new Point4D(-1, 1, -2);
		let p22 = new Point4D(1, 1, -2);
		let p23 = new Point4D(-1, -1, -2);
		let p24 = new Point4D(1, -1, -2);

		// Front Rectangle
		let rectFront = new Rectangle(this.gl, new Point4D(0,0,0), 0.1);
		let vertices = [];
		vertices.push(p11, p12, p14, p13);
		rectFront.setPoints(vertices);
		rectFront.setColor(Scene.PINK_PONG);

		// Back Rectangle
		let rectBack = new Rectangle(this.gl, new Point4D(0,0,0), 0.1);
		vertices = [];
		vertices.push(p21, p22, p24, p23);
		rectBack.setPoints(vertices); 
		rectBack.setColor(Scene.BLUE_PONG);

		// Left Rectangle
		let rectLeft = new Rectangle(this.gl, new Point4D(0,0,0), 0.1);
		vertices = [];
		vertices.push(p23, p21, p11, p13);
		rectLeft.setPoints(vertices);

		// Right Rectangle
		let rectRight = new Rectangle(this.gl, new Point4D(0,0,0), 0.1);
		vertices = [];
		vertices.push(p24, p22, p12, p14);
		rectRight.setPoints(vertices);
		
		// Wireframe Box
		let box = [];
		box.push(rectFront, rectBack, rectLeft, rectRight);
		return box;
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
                // this.player1.translate(0, 0.2);
                break;
			case "ArrowDown":
				this.sendMove(0, -0.2);
                // this.player1.translate(0, -0.2);
				break;
			case "ArrowLeft":
				this.sendMove(-0.1, 0);
				// this.player1.translate(-0.1, 0);
				break;
			case "ArrowRight":
				this.sendMove(0.1, 0);
				// this.player1.translate(0.1, 0);
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
		const camera = new GLCamera(this.cameraZ, aspectRatio);
		return camera.observe();
	}

	private toClipping(point: Point4D, rect: ClientRect): Point4D {
		const x = 2 * (point.x - rect.left) / this.canvas.width - 1;
		const y = 2 * (rect.top - point.y) / this.canvas.height + 1;
		return new Point4D(x, y);
	}

	render() {
		for (let mesh of this.drawablesWire) {
			this.renderingMode = this.gl.LINE_LOOP;
			this.draw(mesh.vectors, mesh.count);
		}

		let gameObjects: IDrawable[];
		if (this.cameraZ == 5) {
			gameObjects = this.drawables;
		} else {
			gameObjects = this.drawables.reverse();
		}
		for (let drawable of gameObjects) {
			this.renderingMode = this.gl.TRIANGLES;
			this.draw(drawable.vectors, drawable.count);
		}
	}

	moveObject(id: string, position: number[]): void {
		const obj = this.gameObjects.has(id) ? this.gameObjects.get(id)! : null;
		if (obj == null) throw new Error(`Gameobj not found: ${id}`);
		const [x, y, z] = position;
		obj.translate(x, y, z, true);
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
	setCameraOrien(fromFront: boolean) {
        this.cameraZ = fromFront ? 5 : -5;
    }
}