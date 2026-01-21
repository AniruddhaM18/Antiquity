import { WebSocket, WebSocketServer } from "ws";

import { IncomingMessage } from "http";

import jwt from "jsonwebtoken";
import { RoomManager } from "./roomManager.js";
import { th } from "zod/locales";
const JWT_SECRET = process.env.JWT_SECRET!;

type AuthSocket = WebSocket & {
    userId?: string;
}

export class SocketServer {
    private wss: WebSocketServer;
    private rooms = new RoomManager();

    constructor(httpServer: any) {
        this.wss = new WebSocketServer({
            server: httpServer,
            path: "/ws"
        });
        this.wss.on("connection", this.onConnection)
    }

    private onConnection(socket: AuthSocket, req: IncomingMessage) {
        try {
            const token = this.extractToken(req);
            const payload = jwt.verify(token, JWT_SECRET) as any;

            socket.userId = payload.userId;

            socket.on("message", (raw) => {
                this.onMessage(socket, raw.toString());
            });

            socket.on("close", ()=> {
                this.rooms.removeSocketEverywhere(socket);
            })
        }catch(err){
            console.log("error is :", err)
            socket.close;
        }
    }

    private extractToken(req: IncomingMessage) {
        const url = new URL(req.url!, "http://localhost");
        const token = url.searchParams.get("token");
        if (!token) throw new Error("missing jwt/token");
        return token;

    }

    private onMessage(socket: AuthSocket, raw: string) {
        const msg = JSON.parse(raw);

        switch (msg.type) {
            case "join:live-contest":
                this.rooms.join(msg.liveContestId, socket);
                break;

            case "leave:leave-contest":
                this.rooms.leave(msg.liveContestId, socket);
                break;
        }
    }

    //called by rest controllers
    public brodcast(liveContestId: string, event: string, payload: any){
        this.rooms.brodcast(liveContestId, event, payload)
    }
}