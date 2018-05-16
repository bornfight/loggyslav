import {Loggyslav} from "./Loggyslav";

export class LoggyslavPool {
    public static getInstance(): LoggyslavPool {
        return this.instance;
    }

    private static instance = new LoggyslavPool();

    public pool: Loggyslav[] = [];

    private constructor() {

    }

    public register(loggyslav: Loggyslav) {
        this.pool.push(loggyslav);
    }
}
