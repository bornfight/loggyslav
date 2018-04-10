import {LoggerParams, LoggerParamsType, LogOptions, PropertyLoggerInterface} from "../interfaces/MethodLoggerInterface";
import {ObjectLogger} from "./ObjectLogger";

export class PropertyLogger extends ObjectLogger implements PropertyLoggerInterface {
    public logPropertyChange(propertyLoggerParams: LoggerParams, options: LogOptions = {}) {
        propertyLoggerParams.type = LoggerParamsType.PROPERTY;
        this.logCall(propertyLoggerParams, options);
    }
}
