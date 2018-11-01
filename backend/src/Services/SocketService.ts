import * as SocketIO from "socket.io"
import {Server, ServerOptions, Socket} from "socket.io"
import Action, {ActionType, Join, Move} from "../Models/Action";

class SocketService {

	public static socketService: SocketService = new SocketService();

	private io: SocketIO.Server;

	private constructor() {
		this.io = SocketIO();
		this.io.on("connect", socket => {
			socket.on("chat message", this.handler.bind(this));
			socket.on("action", this.actionHandler.bind(this));
		});
	}

	public setupChatroom(uuid: string) {
		let namespace = this.io.of(`/${uuid}`); // Creating chat namespace
		namespace.removeAllListeners();
		namespace.on("connect", this.onConnect.bind(this));
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
		socket.removeAllListeners(); // Prevents duplicates
		socket.on("action", message => this.onAction(socket, message));
	}

	private onAction(socket: Socket, rawAction: string) {
		console.log("Message: " + rawAction);
		const action = JSON.parse(rawAction) as Action;
		switch (action.type) {
			case ActionType.NewPosition:
				this.moveAction(action.values as Move);
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

	private moveAction(movement: Move) {

	}

	private joinAction(joining: Join) {

	}
}

export default SocketService.socketService;

