import { WebSocket } from "ws";

export class LiveContestRoom{
    private sockets = new Set<WebSocket>();

    constructor(public readonly livecontestId: string) {}

    add(socket:WebSocket) {
        this.sockets.add(socket)
    }

    remove(socket:WebSocket){
        this.sockets.delete(socket)
    }

    broadcast(event: string, payload: any){
        const message = JSON.stringify({ event, payload });

        for(const socket of this.sockets) {
            if(socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        }
    }

    isEmpty(){
        return this.sockets.size === 0;
    }
}