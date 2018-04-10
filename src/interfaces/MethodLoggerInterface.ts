import {CallSite} from "callsite";
import {LoggerInterface} from "./LoggerInterface";

export enum LoggerParamsType {
    METHOD = "METHOD",
    PROPERTY = "PROPERTY",
}

export interface LogOptions {
    level?: "INFO" | "ERROR";
}

export interface MethodLoggerOptionalLogParams {
    startTimestamp?: number;
    endTimestamp?: number;
    executionTime?: number;
}

export interface LoggerParams extends MethodLoggerOptionalLogParams {
    className?: string;
    inputParams: any[];
    outputValue: any;
    type?: LoggerParamsType;
    propertyName: string;
    stack?: CallSite[];
}

export interface ObjectLoggerInterface extends LoggerInterface {
    timestampStart: number;
    timestampEnd: number;
    executionTime: () => number;
}

export interface MethodLoggerInterface extends ObjectLoggerInterface {
    logMethodCall: (methodLogParams: LoggerParams, options?: LogOptions) => void;
}

export interface PropertyLoggerInterface extends ObjectLoggerInterface {
    logPropertyChange: (propertyLogParams: LoggerParams, options?: LogOptions) => void;
}
