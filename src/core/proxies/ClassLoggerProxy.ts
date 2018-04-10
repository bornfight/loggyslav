import {ClassExtractHelper} from "../../helpers/ClassExtractHelper";
import {LoggerParams} from "../../interfaces/MethodLoggerInterface";
import {MethodLogger} from "../../loggers/MethodLogger";
import {PropertyLogger} from "../../loggers/PropertyLogger";
import {ClassType, LogClassesInterface} from "../Logger";

export class ClassLoggerProxy {

    public logClassProperties: LogClassesInterface;

    protected methodLogger: MethodLogger;
    protected propertyLogger: PropertyLogger;

    constructor(logClass: LogClassesInterface) {
        this.logClassProperties = logClass;

        this.attachClassMethodsProxy();
    }

    public disable(): void {
        if (this.methodLogger !== undefined) {
            this.methodLogger.disable();
        }

        if (this.propertyLogger !== undefined) {
            this.propertyLogger.disable();
        }
    }

    public setMethodLogger(methodLogger: MethodLogger) {
        this.methodLogger = methodLogger;
    }

    public setPropertyLogger(propertyLogger: PropertyLogger) {
        this.propertyLogger = propertyLogger;
    }

    protected methodProxy(method: ((...args: any[]) => any), methodName: string, className?: string) {
        const self = this;

        if (methodName === "constructor" && className !== undefined) {
            methodName = className;
        }

        // Must return proxied function with same name, no anonymous closures
        return {[methodName](...args: any[]) {
                const outputValue = method.bind(this)(...args);

                if (self.methodLogger !== undefined) {
                    const inputParams: any[] = [];
                    args.forEach((value, index: number) => {
                        inputParams.push(value);
                    });

                    const logParams: LoggerParams = {
                        propertyName: methodName,
                        inputParams,
                        outputValue,
                    };

                    if (className !== undefined) {
                        logParams.className = className;
                    }

                    self.methodLogger.logMethodCall(logParams);
                }

                return outputValue;
            }}[methodName];
    }

    protected propertyGetterProxy(className: string, property: string) {
        const self = this;
        const classPropertyGetter = className[property];

        return {[property]() {
                if (self.propertyLogger === undefined) {
                    return classPropertyGetter;
                }

                const logParams: LoggerParams = {
                    propertyName: property,
                    inputParams: [],
                    className,
                    outputValue: undefined,
                };

                self.propertyLogger.logPropertyChange(logParams);
                return classPropertyGetter;
            }}[property];
    }

    protected propertySetterProxy(className: string, property: string) {
        const self = this;
        let classPropertySetter = className[property];

        return {[property](value: any) {
            classPropertySetter = value;

            if (self.propertyLogger === undefined) {
                return;
            }

            const logParams: LoggerParams = {
                propertyName: property,
                inputParams: [value],
                className,
                outputValue: undefined,
            };

            self.propertyLogger.logPropertyChange(logParams);
        }}[property];
    }

    private attachClassMethodsProxy() {
        const classMethods = ClassExtractHelper.getClassMethods(this.logClassProperties.classType);
        const className = ClassExtractHelper.getClassName(this.logClassProperties.classType);

        classMethods.forEach( (methodName: string) => {
            if (this.logClassProperties.methods !== undefined &&
                this.logClassProperties.methods.indexOf(methodName) < 0) {
                return;
            }

            const method = this.logClassProperties.classType.prototype[methodName];
            this.logClassProperties.classType.prototype[methodName] = this.methodProxy(method, methodName, className);
        });

        if (this.logClassProperties.properties === undefined) {
            return;
        }

        this.logClassProperties.properties.forEach((property: string) => {
            this.logClassProperties.classType.prototype[property] = Object.defineProperty(
                this.logClassProperties.classType.prototype,
                property,
                {
                    set: this.propertySetterProxy(className, property),
                    configurable: true,
                },
            );
        });
    }
}
