import * as SocketIO from "socket.io"
import {Namespace, Server, ServerOptions, Socket} from "socket.io"
import Action, {ActionType, Join, Move} from "../Models/Action";
import GameService from "./GameService";
import {Vector3} from "math3d";

class SocketService {

	public static socketService: SocketService = new SocketService();

	private io: SocketIO.Server;
	private gameService = GameService.Instance;

	private gameRooms: Map<string, Namespace> = new Map();

	private constructor() {
		this.io = SocketIO();
		this.io.on("connect", socket => {
			socket.on("chat message", this.handler.bind(this));
			socket.on("action", this.actionHandler.bind(this));
		});
	}

	public privateAction(socketId: string, action: Action) {
		this.io.to(socketId).send(JSON.stringify(action));
	}

	public sendAction(uuid: string, action: Action) {
		if (!this.gameRooms.has(uuid)) throw new Error("Game room does not exist");
		const room = this.gameRooms.get(uuid)!;
		room.emit("action", JSON.stringify(action));
	}

	public setupChatroom(uuid: string, onCreate: (socket: Socket) => string) { // TODO
		let namespace = this.io.of(`/${uuid}`); // Creating chat namespace
		namespace.removeAllListeners();
		namespace.on("connect", socket => {
			const player = onCreate(socket);
            this.privateAction(socket.id, {
                type: ActionType.JoinGame,
                values: {userId: name}
            });
			this.onConnect(socket);
		});

		this.gameRooms.set(uuid, namespace);
	}

	public listen(server: any, opts?: ServerOptions): Server {
		return this.io.listen(server, opts);
	}

	private handler (msg: string) {
		console.log(msg);
	}

	private actionHandler (msg: string) {
		console.log(msg);
	}

	private onConnect(socket: Socket) {
		console.log("User joined");
		socket.removeAllListeners(); // Prevents duplicates
		socket.on("action", message => this.onAction(socket, message));
	}

	private onAction(socket: Socket, rawAction: string) {
		const gameId = socket.nsp.name;
		console.log("Message: " + rawAction);
		let action: Action | null = null;
		try {
			action = JSON.parse(rawAction) as Action;
		} catch (e) {
			console.log(`Could not parse json (Fuck Miguel): ${e}`);
			return;
		}
		switch (action.type) {
			case ActionType.NewPosition:
				this.moveAction(gameId, action.values as Move);
				break;
			case ActionType.JoinGame:
				this.joinAction(action.values as Join);
				break;
			case ActionType.Goal:
				break;
			case ActionType.UpdateScores:
				break;
			case ActionType.Winner:
				break;
			default:
				throw new Error("Unsupported action");
		}
		socket.emit(rawAction);
	}

	private moveAction(gameId: string, movement: Move) {
		this.gameService.moveObject(gameId, movement.objectId, new Vector3(movement.x, movement.y, movement.z));
	}

	private joinAction(joining: Join) {

	}
}

export default SocketService.socketService;

