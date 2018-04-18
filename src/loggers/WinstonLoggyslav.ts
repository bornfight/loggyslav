import {LogCallback, LoggerInstance} from "winston";
import {SimpleMethodLoggyslav} from "../core/loggers/SimpleMethodLoggyslav";

export class WinstonLoggyslav extends SimpleMethodLoggyslav {

    public logger: LoggerInstance;
    public levels = {
        error: "error",
        log: "info",
        info: "info",
    };

    constructor(logger: LoggerInstance) {
        super();
        this.logger = logger;
    }

    public log(...args: any[]): void {
        this.logger.log(this.levels.log, "Log:", ...args);
    }

    public error(...args: any[]): void {
        this.logger.error(this.levels.error, "Error:", ...args);
    }

    public info(...args: any[]): void {
        this.logger.info(this.levels.info, "Error:", ...args);
    }
}
