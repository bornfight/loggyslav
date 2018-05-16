import {ErrorObject, LogOptions} from "./LoggerInterface";
import {ObjectLoggerInterface} from "./ObjectLoggerInterface";

export interface ErrorLoggerInterface extends ObjectLoggerInterface {
    logError: (errorObject: ErrorObject, options?: LogOptions) => void;
}
