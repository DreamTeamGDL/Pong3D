
import {Queue} from "typescript-collections"
import * as UUID from "uuid"

export default class MatchMaker {

    private queue: Queue<DeferredPromise<string>>;
    private cycle: NodeJS.Timer | null = null;
    private cycleCounter: number;
    private maxTime: number;
    private frequency: number;

    public constructor(maxTime: number, frequency: number) {
        this.queue = new Queue();
        this.cycleCounter = 0;
        this.maxTime = maxTime;
        this.frequency = frequency;
    }

    public requestUuid: () => Promise<string> = async() => {
        let deferred = new DeferredPromise<string>();
        this.queue.enqueue(deferred);
        if (this.cycle == null) {
            this.cycle = setInterval(this.matchCycle, this.frequency); //Enable spinlock
        }
        return deferred.promise;
    }

    private matchCycle: () => void = () => {
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
            let uuid: string = UUID.v4();
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

    public constructor() {
        this.prom = new Promise<T>((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
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
}