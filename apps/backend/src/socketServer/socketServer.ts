import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import { RoomManager } from "./roomManager.js";
import { RedisPubSub } from "./redisPubSub.js";
import { liveContestStore } from "../redis/liveContestStore.js";

const JWT_SECRET = process.env.JWT_SECRET!;

type AuthSocket = WebSocket & {
    userId?: string;
}

export class SocketServer {
    private wss: WebSocketServer;
    private rooms = new RoomManager();
    private pubSub: RedisPubSub;

    constructor(httpServer: any) {
        this.wss = new WebSocketServer({
            server: httpServer,
            path: "/ws"
        });

        // Initialize Redis Pub/Sub
        this.pubSub = new RedisPubSub();

        this.wss.on("connection", (socket, req) => {
            this.onConnection(socket as AuthSocket, req)
        });
    }

    private onConnection(socket: AuthSocket, req: IncomingMessage) {
        try {
            const token = this.extractToken(req);
            const payload = jwt.verify(token, JWT_SECRET) as any;

            socket.userId = payload.userId;

            socket.on("message", async (raw) => {
                this.onMessage(socket, raw.toString());
            });

            socket.on("close", () => {
                this.rooms.removeSocketEverywhere(socket);
            })
        } catch (err) {
            console.log("error is :", err)
            socket.close();
        }
    }

    private extractToken(req: IncomingMessage) {
        const url = new URL(req.url!, "http://localhost");
        const token = url.searchParams.get("token");
        if (!token) throw new Error("missing jwt/token");
        return token;
    }

    private async onMessage(socket: AuthSocket, raw: string) {
        try {
            let msg: any;
            try {
                msg = JSON.parse(raw);
            } catch {
                return;
            }

            switch (msg.type) {
                case "join:live-contest": {
                    if (!socket.userId) return;

                    const { liveContestId } = msg;

                    // Get from Redis (no DB query!)
                    const state = await liveContestStore.getByLiveId(liveContestId);

                    if (!state) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "Live contest not found" }
                        }));
                        return;
                    }

                    if (state.createdBy === socket.userId) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "Host can't join as participant" }
                        }));
                        return;
                    }

                    if (!state.memberIds.includes(socket.userId)) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "You are not a member of this contest" }
                        }));
                        return;
                    }

                    if (state.endedAt) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "Contest already ended" }
                        }));
                        return;
                    }

                    // Join local room (for this server)
                    this.rooms.join(liveContestId, socket);

                    // Subscribe to Redis Pub/Sub (for cross-server broadcasts)
                    await this.pubSub.subscribe(liveContestId, socket);

                    // Sync state
                    socket.send(JSON.stringify({
                        event: "contest:sync",
                        payload: {
                            liveContestId,
                            currentIndex: state.currentIndex,
                            totalQuestions: state.questions.length,
                            startedAt: state.startedAt,
                            endedAt: state.endedAt
                        }
                    }));
                    break;
                }

                case "leave:live-contest": {
                    const { liveContestId } = msg;
                    this.rooms.leave(liveContestId, socket);
                    await this.pubSub.unsubscribe(liveContestId, socket);
                    break;
                }
            }
        } catch (err) {
            console.error("WS Message error :", err);
            socket.send(JSON.stringify({
                event: "error",
                payload: { message: "Internal Socket error" }
            }))
        }
    }

     //Broadcast to all servers via Redis Pub/Sub

    public async broadcast(liveContestId: string, event: string, payload: any) {
        // Publish to Redis (all servers will receive and broadcast to their sockets)
        await this.pubSub.publish(liveContestId, event, payload);
    }
}