
import * as Express from "express";
import * as Parser from "body-parser";
import * as Http from "http";

import matchMakingRouter from "./Routers/MatchMakingRouter"
import socketService from "./Services/SocketService"

const app: Express.Application = Express();
const port = 3000;

app.use((req, res, next) => { // Handle CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app
    .use(Parser.json())
    .use("/", matchMakingRouter);

let server: Http.Server = app.listen(port);
socketService.listen(server);

console.log(`Listening with <3 on port ${port}`);