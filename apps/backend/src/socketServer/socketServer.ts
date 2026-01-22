import { WebSocket, WebSocketServer } from "ws";

import { IncomingMessage } from "http";

import jwt from "jsonwebtoken";
import { RoomManager } from "./roomManager.js";
import { prisma } from "@repo/database";
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
        this.wss.on("connection", (socket, req) => {
            this.onConnection(socket as AuthSocket, req)
        })
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

                    const liveContest = await prisma.liveContest.findUnique({
                        where: { id: liveContestId },
                        include: {
                            contest: {
                                include: {
                                    members: {
                                        where: { userId: socket.userId }
                                    },
                                    questions: true
                                }
                            }
                        }
                    });

                    if (!liveContest) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "Live contest not found" }
                        }));
                        return
                    };

                    if (liveContest.contest.createdBy === socket.userId) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "host can't join as participant" }
                        }));
                        return;
                    }

                    console.log("WS JOIN CHECK", {
                        socketUserId: socket.userId,
                        contestId: liveContest.contestId
                    });


                    if (liveContest.contest.members.length === 0) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "You are not a member of this contest" }
                        }));
                        return;
                    }

                    if (liveContest.endedAt) {
                        socket.send(JSON.stringify({
                            event: "error",
                            payload: { message: "Contest already ended" }
                        }));
                        return;
                    }

                    //join room
                    this.rooms.join(liveContestId, socket);

                    //sync state
                    socket.send(JSON.stringify({
                        event: "contest:sync",
                        payload: {
                            liveContestId,
                            currentIndex: liveContest.currentIndex,
                            totalQuestions: liveContest.contest.questions.length,
                            startedAt: liveContest.startedAt,
                            endedAt: liveContest.endedAt
                        }
                    }));
                    break;
                }

                case "leave:live-contest": {
                    this.rooms.leave(msg.liveContestId, socket);
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

    //called by rest controllers
    public broadcast(liveContestId: string, event: string, payload: any) {
        this.rooms.broadcast(liveContestId, event, payload)
    }
}