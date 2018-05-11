import {MethodLoggerInterface} from "../interfaces/MethodLoggerInterface";
import {PropertyLogger} from "./loggers/PropertyLogger";
import {SimpleMethodLoggyslav} from "./loggers/SimpleMethodLoggyslav";
import {ClassLoggerProxy} from "./proxies/ClassLoggerProxy";

export type ClassType = new (...args: any[]) => any;
export interface LogClassesInterface {
    classType: ClassType;
    methods?: string[];
    properties?: string[];
}

export interface TargetsConfiguration {
    targets: LogClassesInterface[];
}

export interface LoggersInterface {
    methodLogger: SimpleMethodLoggyslav;
    propertyLogger?: PropertyLogger;
}

export interface LoggerConfiguration extends LoggersInterface {
    logLevel?: string;
}

export class Loggyslav {
    private logDataConfiguration: TargetsConfiguration = {
        targets: [],
    };

    private loggerConfiguration: LoggerConfiguration = {
        methodLogger: new SimpleMethodLoggyslav(),
    };

    private classLoggers: ClassLoggerProxy[] = [];

    constructor(logDataConfiguration: TargetsConfiguration, loggerConfiguration: LoggerConfiguration) {
        this.setLogDataConfiguration(logDataConfiguration);
        this.setLoggerConfiguration(loggerConfiguration);
        this.attachLoggers();
    }

    public disable() {
        this.classLoggers.forEach((classLogger: ClassLoggerProxy) => {
            classLogger.disable();
        });
    }

    private addClassLogger(classLogger: ClassLoggerProxy) {
        this.classLoggers.push(classLogger);
    }

    private setLogDataConfiguration(logDataConfiguration: TargetsConfiguration) {
        for (const key in logDataConfiguration) {
            if (logDataConfiguration[key] === undefined) {
                continue;
            }

            this.logDataConfiguration[key] = logDataConfiguration[key];
        }
    }

    private setLoggerConfiguration(loggerConfiguration: LoggerConfiguration) {
        for (const key in loggerConfiguration) {
            if (loggerConfiguration[key] === undefined) {
                continue;
            }

            this.loggerConfiguration[key] = loggerConfiguration[key];
        }
    }

    private attachLoggers() {
        this.attachClassLoggers();
    }

    private attachClassLoggers() {
        this.logDataConfiguration.targets.forEach((logClass: LogClassesInterface) => {
            const classLoggerProxy = new ClassLoggerProxy(logClass);
            classLoggerProxy.setMethodLogger(this.loggerConfiguration.methodLogger);

            if (this.loggerConfiguration.propertyLogger !== undefined) {
                classLoggerProxy.setPropertyLogger(this.loggerConfiguration.propertyLogger);
            }

            this.addClassLogger(classLoggerProxy);
        });
    }
}
