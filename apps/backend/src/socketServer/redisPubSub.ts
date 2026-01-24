import { WebSocket } from "ws";
import { redis } from "../redis/redisClient.js";

//pubsub channels

const CHANNELS = {
    contest: (liveContestId: string) => `pubsub:contest:${liveContestId}`, 
};

export class RedisPubSub {
    private subscribers = new Map<string, Set<WebSocket>>();
    private subscriber: any; //redis subscriber instance

    constructor(){
                // Create separate Redis connection for Pub/Sub (required by Redis)
                this.subscriber = redis.duplicate();
                this.setupSubscriber();

    }

    //setup a redis subscriber to listen for messages
    private setupSubscriber() {
        this.subscriber.on("mesage", (channel : string, message: string) => {
            const sockets = this.subscribers.get(channel);
            if(!sockets) return;

            //broadcast to all webscoket connections in this channnel 
            for(const socket of sockets) {
                if(socket.readyState === WebSocket.OPEN) {
                    try {
                        socket.send(message)
                    } catch(error) {
                        console.error("Error sending socket : ", error)
                    }
                }
            }
        });
    }

    // subscribe websocet to a contest channnel 
    async subscribe(liveContestId: string, socket: WebSocket):Promise<void> {
        const channel = CHANNELS.contest(liveContestId);

        //Add socket to subscribers
        if(!this.subscribers.has(channel)) {
            this.subscribers.set(channel, new Set());
            //subscrib tp redis channel event
            await this.subscriber.subscribe(channel);
        }

        this.subscribers.get(channel)!.add(socket);
        //handle socket close
        socket.on("close", ()=> {
            this.unsubscribe(liveContestId, socket);
        })
    }

    //unsubscribe websocket from a constatnt channel
    async unsubscribe(liveContestId:string, socket:WebSocket):Promise <void> {
        const channel = CHANNELS.contest(liveContestId);
        const sockets = this.subscribers.get(channel);

        if(sockets) {
            sockets.delete(socket);

            //if no more sockets unsubscribe form redis
            if(sockets.size === 0) {
                this.subscribers.delete(channel);
                await this.subscriber.unsubscribe(channel);
            }
        }
    }

    //publish message to ll servres (cross server broadcasst)
    async publish(liveContestId:string, event:string, payload: any):Promise<void> {
        const channel = CHANNELS.contest(liveContestId);
        const message = JSON.stringify({event, payload});

        //publish to servers all servers will recive this
        await redis.publish(channel, message)
    }

    //cleanup on shuuutdown
    async close():Promise<void>{
        await this.subscriber.quit();
    }
}