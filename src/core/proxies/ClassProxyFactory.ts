import {LoggerParams} from "../../interfaces/LoggerInterface";
import {LoggersInterface} from "../Loggyslav";

export class ClassProxyFactory {
    private className: string;
    private loggers: LoggersInterface;

    constructor(loggers: LoggersInterface, className: string) {
        this.className = className;
        this.loggers = loggers;
    }

    public createMethodProxy(
       method: ((...args: any[]) => any), methodName: string): (...args: any[]) => (...args: any[]) => any {
        const self = this;

        if (methodName === "constructor" && this.className !== undefined) {
            methodName = this.className;
        }
        // Must return proxied function with same name, no anonymous closures
        return {[methodName](...args: any[]) {
                let outputValue: any;

                try {
                    outputValue = method.bind(this)(...args);
                } catch (e) {
                    if (self.loggers.errorLogger !== undefined) {
                        self.loggers.errorLogger.logError({
                            message: e.message,
                        });
                    }
                    throw e;
                }

                if (self.loggers.methodLogger === undefined) {
                    return;
                }

                const inputParams: any[] = [];
                args.forEach((value) => {
                    inputParams.push(value);
                });

                const logParams: LoggerParams = {
                    propertyName: methodName,
                    inputParams,
                    outputValue,
                };

                if (self.className !== undefined) {
                    logParams.className = self.className;
                }

                self.loggers.methodLogger.logMethodCall(logParams);

                return outputValue;
            }}[methodName];
    }

    public createPropertyGetterProxy(property: string) {
        const self = this;
        const classPropertyGetter = self.className[property];

        return {[property]() {
                if (self.loggers.propertyLogger === undefined) {
                    return classPropertyGetter;
                }

                const logParams: LoggerParams = {
                    propertyName: property,
                    inputParams: [],
                    className: self.className,
                    outputValue: undefined,
                };

                self.loggers.propertyLogger.logPropertyChange(logParams);
                return classPropertyGetter;
            }}[property];
    }

    public createPropertySetterProxy(property: string) {
        const self = this;
        let classPropertySetter = self.className[property];

        return {[property](value: any) {
                classPropertySetter = value;

                if (self.loggers.propertyLogger === undefined) {
                    return;
                }

                const logParams: LoggerParams = {
                    propertyName: property,
                    inputParams: [value],
                    className: self.className,
                    outputValue: undefined,
                };

                self.loggers.propertyLogger.logPropertyChange(logParams);
            }}[property];
    }
}
