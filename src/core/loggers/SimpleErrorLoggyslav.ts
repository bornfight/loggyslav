import {ErrorLoggerInterface} from "../../interfaces/ErrorLoggerInterface";
import {ErrorObject, LogOptions} from "../../interfaces/LoggerInterface";
import {ObjectLogger} from "./ObjectLogger";

export class SimpleErrorLoggyslav extends ObjectLogger implements ErrorLoggerInterface {
    public logError(error: ErrorObject, options: LogOptions = {}): void {
        this.error(error.message);
    }
}
