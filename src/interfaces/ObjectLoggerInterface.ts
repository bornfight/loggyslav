import {LoggerInterface} from "./LoggerInterface";

export interface ObjectLoggerInterface extends LoggerInterface {
    timestampStart: number;
    timestampEnd: number;
    executionTime: () => number;
}
