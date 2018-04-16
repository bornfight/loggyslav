import {LoggerParams, LogOptions} from "./LoggerInterface";
import {ObjectLoggerInterface} from "./ObjectLoggerInterface";

export interface PropertyLoggerInterface extends ObjectLoggerInterface {
    logPropertyChange: (propertyLogParams: LoggerParams, options?: LogOptions) => void;
}
