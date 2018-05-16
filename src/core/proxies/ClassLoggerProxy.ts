import {ClassExtractHelper} from "../../helpers/ClassExtractHelper";
import {LoggerParams} from "../../interfaces/LoggerInterface";
import {PropertyLogger} from "../loggers/PropertyLogger";
import {SimpleErrorLoggyslav} from "../loggers/SimpleErrorLoggyslav";
import {SimpleMethodLoggyslav} from "../loggers/SimpleMethodLoggyslav";
import {LogClassesInterface, LoggersInterface} from "../Loggyslav";
import {ClassProxyFactory} from "./ClassProxyFactory";

export class ClassLoggerProxy {

    public logClassProperties: LogClassesInterface;

    protected loggers: LoggersInterface = {
        methodLogger: new SimpleMethodLoggyslav(),
    };

    constructor(logClass: LogClassesInterface) {
        this.logClassProperties = logClass;
    }

    public disable(): void {
        if (this.loggers.methodLogger !== undefined) {
            this.loggers.methodLogger.disable();
        }

        if (this.loggers.propertyLogger !== undefined) {
            this.loggers.propertyLogger.disable();
        }
    }

    public enable(): void {
        if (this.loggers.methodLogger !== undefined) {
            this.loggers.methodLogger.enable();
        }

        if (this.loggers.propertyLogger !== undefined) {
            this.loggers.propertyLogger.enable();
        }
    }

    public setMethodLogger(methodLogger: SimpleMethodLoggyslav) {
        this.loggers.methodLogger = methodLogger;
    }

    public setPropertyLogger(propertyLogger: PropertyLogger) {
        this.loggers.propertyLogger = propertyLogger;
    }

    public setErrorLogger(errorLogger: SimpleErrorLoggyslav) {
        this.loggers.errorLogger = errorLogger;
    }

    public attachClassMethodsProxy() {
        const classMethods = ClassExtractHelper.getClassMethods(this.logClassProperties.classType);
        const className = ClassExtractHelper.getClassName(this.logClassProperties.classType);
        const classProxyFactory = new ClassProxyFactory(this.loggers, className);

        classMethods.forEach( (methodName: string) => {
            if (this.logClassProperties.methods !== undefined &&
                this.logClassProperties.methods.indexOf(methodName) < 0) {
                return;
            }

            const method = this.logClassProperties.classType.prototype[methodName];
            this.logClassProperties.classType.prototype[methodName] =
                classProxyFactory.createMethodProxy(method, methodName);

        });

        if (this.logClassProperties.properties === undefined) {
            return;
        }

        this.logClassProperties.properties.forEach((property: string) => {
            Object.defineProperty(
                this.logClassProperties.classType.prototype,
                property,
                {
                    set: classProxyFactory.createPropertySetterProxy(property),
                    configurable: true,
                },
            );
        });

    }
}
