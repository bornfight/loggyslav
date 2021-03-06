import {CallSite} from "callsite";

export interface LoggerInterface {
    log: (...args: any[]) => any;
    info: (...args: any[]) => any;
    error: (...args: any[]) => any;
}

export enum LoggerParamsType {
    METHOD = "METHOD",
    PROPERTY = "PROPERTY",
}

export interface LogOptions {
    level?: "INFO" | "ERROR";
}

export interface LoggerOptionalLogParams {
    startTimestamp?: number;
    endTimestamp?: number;
    executionTime?: number;
}

export interface LoggerParams extends LoggerOptionalLogParams {
    className?: string;
    inputParams: any[];
    outputValue: any;
    type?: LoggerParamsType;
    propertyName: string;
    stack?: CallSite[];
}

export interface ErrorObject extends LoggerOptionalLogParams {
    message: string;
}
