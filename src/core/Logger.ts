import {MethodLogger} from "../loggers/MethodLogger";
import {PropertyLogger} from "../loggers/PropertyLogger";
import {ClassLoggerProxy} from "./proxies/ClassLoggerProxy";

export type ClassType = new (...args: any[]) => any;
export interface LogClassesInterface {
    classType: ClassType;
    methods?: string[];
    properties?: string[];
}

export interface LogDataConfiguration {
    classes: LogClassesInterface[];
}

export interface LoggerConfiguration {
    methodLogger: MethodLogger;
    propertyLogger?: PropertyLogger;
}

export class Logger {
    private logDataConfiguration: LogDataConfiguration = {
        classes: [],
    };

    private loggerConfiguration: LoggerConfiguration = {
        methodLogger: new MethodLogger(),
    };

    private classLoggers: ClassLoggerProxy[] = [];

    constructor(logDataConfiguration: LogDataConfiguration, loggerConfiguration: LoggerConfiguration) {
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

    private setLogDataConfiguration(logDataConfiguration: LogDataConfiguration) {
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
        this.logDataConfiguration.classes.forEach((logClass: LogClassesInterface) => {
            const classLoggerProxy = new ClassLoggerProxy(logClass);
            classLoggerProxy.setMethodLogger(this.loggerConfiguration.methodLogger);

            if (this.loggerConfiguration.propertyLogger !== undefined) {
                classLoggerProxy.setPropertyLogger(this.loggerConfiguration.propertyLogger);
            }

            this.addClassLogger(classLoggerProxy);
        });
    }
}
