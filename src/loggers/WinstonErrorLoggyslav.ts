import {ErrorLoggerInterface} from "../interfaces/ErrorLoggerInterface";
import {ErrorObject, LogOptions} from "../interfaces/LoggerInterface";
import {WinstonLoggyslav} from "./WinstonLoggyslav";

export class WinstonErrorLoggyslav extends WinstonLoggyslav implements ErrorLoggerInterface {
    public logError(errorObject: ErrorObject, options?: LogOptions): void {
        this.error(errorObject.message);
    }

}
