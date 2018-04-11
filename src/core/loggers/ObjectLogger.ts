/* tslint:disable:no-console */
import {LoggerParams, LoggerParamsType, LogOptions} from "../../interfaces/LoggerInterface";
import {ObjectLoggerInterface} from "../../interfaces/ObjectLoggerInterface";
import {MethodLogger} from "./MethodLogger";

export class ObjectLogger implements ObjectLoggerInterface {
    public static LOGGER_ON = true;

    public loggerOn = true;
    public timestampEnd: number = 0;
    public timestampStart: number = 0;

    public disable(): void {
        this.loggerOn = false;
    }

    public enable(): void {
        this.loggerOn = true;
    }

    public error(...args: any[]): void {
        //
    }

    public executionTime() {
        return this.timestampEnd - this.timestampStart;
    }

    public info(...args: any[]): void {
        //
    }

    public isOn(): boolean  {
        if (MethodLogger.LOGGER_ON === false) {
            return false;
        }

        return this.loggerOn;
    }

    public log(...args: any[]): void {
        if (!this.isOn()) {
            return;
        }

        console.log(...args);
    }

    public logCall(loggerParams: LoggerParams, options: LogOptions = {}): void {
        const logParams = [];

        if (loggerParams.className !== undefined) {
            logParams.push(this.getLogKeyValue("Class", loggerParams.className));
        }

        if (loggerParams.type === LoggerParamsType.METHOD) {
            logParams.push(this.getLogKeyValue("Method", loggerParams.propertyName));
        }

        if (loggerParams.type === LoggerParamsType.PROPERTY) {
            logParams.push(this.getLogKeyValue("Property", loggerParams.propertyName));
        }

        if (loggerParams.type !== undefined) {
            logParams.push(this.getLogKeyValue("Type", loggerParams.type));
        }

        if (loggerParams.startTimestamp !== undefined) {
            logParams.push(this.getLogKeyValue("Start", loggerParams.startTimestamp));
        }

        if (loggerParams.endTimestamp !== undefined) {
            logParams.push(this.getLogKeyValue("End", loggerParams.endTimestamp));
        }

        if (loggerParams.executionTime !== undefined) {
            logParams.push(this.getLogKeyValue("Execution time", loggerParams.executionTime));
        }

        logParams.push("Params: ");
        logParams.push(loggerParams.inputParams);

        logParams.push("Output: ");
        logParams.push(loggerParams.outputValue);

        this.log(...logParams);
    }

    protected getLogKeyValue( key: string, value: string | number) {
        return `${key}: ${value}`;
    }
}
