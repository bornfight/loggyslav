import {LoggerParams, LoggerParamsType, LogOptions, MethodLoggerInterface} from "../interfaces/MethodLoggerInterface";
import {ObjectLogger} from "./ObjectLogger";

export class MethodLogger extends ObjectLogger implements MethodLoggerInterface {
    public logMethodCall(methodLogParams: LoggerParams, options: LogOptions = {}): void {
        methodLogParams.type = LoggerParamsType.METHOD;
        this.logCall(methodLogParams, options);
    }
}
