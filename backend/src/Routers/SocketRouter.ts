import * as Socket from "socket.io"

let io: SocketIO.Server = Socket();

let handler: (msg: string) => void = (msg) => {
    console.log(msg);
};

let actionHandler = (msg: string) => {
    console.log(msg);
};

io.on("connect", (socket: SocketIO.Socket) => {
    socket.on("chat message", handler);
    socket.on("action", actionHandler);
});

export default io;