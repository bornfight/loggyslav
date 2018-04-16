import {LoggerParams, LogOptions} from "./LoggerInterface";
import {ObjectLoggerInterface} from "./ObjectLoggerInterface";

export interface MethodLoggerInterface extends ObjectLoggerInterface {
    logMethodCall: (methodLogParams: LoggerParams, options?: LogOptions) => void;
}
