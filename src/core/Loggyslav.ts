import {MethodLoggerInterface} from "../interfaces/MethodLoggerInterface";
import {PropertyLogger} from "./loggers/PropertyLogger";
import {SimpleErrorLoggyslav} from "./loggers/SimpleErrorLoggyslav";
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
    errorLogger?: SimpleErrorLoggyslav;
}

export interface LoggerConfiguration extends LoggersInterface {
    logLevel?: string;
}

export class Loggyslav {
    private targetsConfiguration: TargetsConfiguration = {
        targets: [],
    };

    private loggerConfiguration: LoggerConfiguration = {
        methodLogger: new SimpleMethodLoggyslav(),
    };

    private classLoggers: ClassLoggerProxy[] = [];

    constructor(targetsConfiguration: TargetsConfiguration, loggerConfiguration: LoggerConfiguration) {
        this.setTargetsConfiguration(targetsConfiguration);
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

    private setTargetsConfiguration(targetsConfiguration: TargetsConfiguration) {
        for (const key in targetsConfiguration) {
            if (targetsConfiguration[key] === undefined) {
                continue;
            }

            this.targetsConfiguration[key] = targetsConfiguration[key];
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
        this.targetsConfiguration.targets.forEach((logClass: LogClassesInterface) => {
            const classLoggerProxy = new ClassLoggerProxy(logClass);
            classLoggerProxy.setMethodLogger(this.loggerConfiguration.methodLogger);

            if (this.loggerConfiguration.errorLogger !== undefined) {
                classLoggerProxy.setErrorLogger(this.loggerConfiguration.errorLogger);

            }

            if (this.loggerConfiguration.propertyLogger !== undefined) {
                classLoggerProxy.setPropertyLogger(this.loggerConfiguration.propertyLogger);
            }

            classLoggerProxy.attachClassMethodsProxy();

            this.addClassLogger(classLoggerProxy);
        });

    }
}
