import { WebSocket } from "ws";
import { LiveContestRoom } from "./liveContestRoom.js";
import { th } from "zod/locales";

export class RoomManager {
    private rooms = new Map<string, LiveContestRoom>();

    join(livecontestId: string, socket: WebSocket) {
        if(!this.rooms.has(livecontestId)){
            this.rooms.set(
                livecontestId,
                new LiveContestRoom(livecontestId)
            );
        }
        this.rooms.get(livecontestId)!.add(socket);
    }

    leave(livecontestId: string, socket: WebSocket) {
        const room = this.rooms.get(livecontestId);
        if(!room) return;

        room.remove(socket);
        if(room.isEmpty()) {
            this.rooms.delete(livecontestId)
        }
    }

    removeSocketEverywhere(socket:WebSocket) {
        for(const[id, room] of this.rooms) {
            room.remove(socket);
            if(room.isEmpty()) {
                this.rooms.delete(id);
            }
        }
    }

    brodcast(livecontestId: string, event:string, payload:any){
        this.rooms.get(livecontestId)?.broadcast(event, payload);
    }
}

