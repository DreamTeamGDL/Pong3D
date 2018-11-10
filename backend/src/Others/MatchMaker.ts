
import {Queue} from "typescript-collections"
import * as UUID from "uuid"
import GameService from "../Services/GameService";
import socketService from "../Services/SocketService";
import {setInterval} from "timers";

export default class MatchMaker {

    private queue: Queue<DeferredPromise<string>>;
    private cycle: NodeJS.Timer | null = null;
    private cycleCounter: number;
    private maxTime: number;
    private frequency: number;
    private gameService: GameService;

    public constructor(maxTime: number, frequency: number) {
        this.queue = new Queue();
        this.cycleCounter = 0;
        this.maxTime = maxTime;
        this.frequency = frequency;
        this.gameService = new GameService();
    }

    public async requestGameId(username: string): Promise<string> {
        let deferred = new DeferredPromise<string>(username);
        this.queue.enqueue(deferred);
        if (this.cycle == null) {
            this.cycle = setInterval(this.matchCycle.bind(this), this.frequency); //Enable spinlock
        }
        return deferred.promise;
    }

    private async matchCycle() {
        if (this.cycleCounter > this.maxTime * (1000 / this.frequency)) {
            let aloneDude = this.queue.dequeue()!;
            aloneDude.reject(new Error("No partner found"));
            clearInterval(this.cycle as NodeJS.Timer); //Disable spinlock
            this.cycle = null;
            this.cycleCounter = 0;
        }
        if (this.queue.size() > 1) {
            let first = this.queue.dequeue()!;
            let second = this.queue.dequeue()!;
            const firstPlayer = first.data as string;
            const secondPlayer = second.data as string;
            let uuid: string = UUID.v4();
            await this.gameService.createGame(uuid, firstPlayer, secondPlayer);
			this.gameService.startGame(uuid);
            first.resolve(uuid);
            second.resolve(uuid);
            this.cycleCounter = 0;
            if (this.queue.size() == 0) {
                clearInterval(this.cycle as NodeJS.Timer)
                this.cycle = null;
            };
        }
        this.cycleCounter++;
    }

}

class DeferredPromise<T> {
    
    private prom: Promise<T>;
    private res: ((value?: T) => void) | null = null;
    private rej: ((reason?: any) => void) | null = null;
    private state?: any;

    public constructor(data?: any) {
        this.prom = new Promise<T>((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
        if (data) this.state = data;
    }

    public get promise(): Promise<T> {
        return this.prom;
    }

    public get resolve(): (value?: T) => void {
        return this.res!;
    }

    public get reject(): (reason?: any) => void {
        return this.rej!;
    }

    public get data(): any {
        return this.state ? this.state : null;
    }
}