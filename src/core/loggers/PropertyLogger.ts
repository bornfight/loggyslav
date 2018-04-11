import {LoggerParams, LoggerParamsType, LogOptions} from "../../interfaces/LoggerInterface";
import {PropertyLoggerInterface} from "../../interfaces/PropertyLoggerInterface";
import {ObjectLogger} from "./ObjectLogger";

export class PropertyLogger extends ObjectLogger implements PropertyLoggerInterface {
    public logPropertyChange(propertyLoggerParams: LoggerParams, options: LogOptions = {}) {
        propertyLoggerParams.type = LoggerParamsType.PROPERTY;
        this.logCall(propertyLoggerParams, options);
    }
}
