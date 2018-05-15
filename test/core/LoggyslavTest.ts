/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
/* tslint:disable:no-dead-store */
/* tslint:disable:no-empty */

import * as chai from "chai";
import {
    only, skip, suite, test,
} from "mocha-typescript";
import * as sinon from "sinon";
import {SinonSandbox} from "sinon";
import sinonChai = require("sinon-chai");
import {PropertyLogger} from "../../src/core/loggers/PropertyLogger";
import {SimpleErrorLoggyslav} from "../../src/core/loggers/SimpleErrorLoggyslav";
import {SimpleMethodLoggyslav} from "../../src/core/loggers/SimpleMethodLoggyslav";
import {Loggyslav, TargetsConfiguration} from "../../src/core/Loggyslav";
import {LoggerConfiguration} from "../../src/index";
import {LoggerParams, LoggerParamsType} from "../../src/interfaces/LoggerInterface";
import {SimpleClass} from "../stubs/SimpleClass";
import {SomeOtherClass} from "../stubs/SomeOtherClass";

const expect = chai.expect;

chai.use(sinonChai);

@suite("Loggyslav")
export class LoggyslavTest {
    public static EXPECT_MESSAGE = {
        INPUT_PARAMS: "Should have expected input params",
        AT_LEAST_ONCE: "Should be called at least once",
        AT_LEAST_TWICE: "Should be called at least twice",
        CLASS_NAME: "Should have expected class name",
        METHOD_NAME: "Should have expected method name",
        PROPERTY_NAME: "Should have expected property name",
        TO_BE_PROPERTY: "Should be a property logger",
    };

    protected logger: Loggyslav;
    protected sandbox: SinonSandbox;

    protected getDefaultLogDataConfiguration(): TargetsConfiguration {
        return {
            targets: [
                {
                    classType: SimpleClass,
                    properties: ["a"],
                },
            ],
        };
    }

    protected initNewLogger(targetsConfiguration: TargetsConfiguration, loggerConfiguration: LoggerConfiguration) {
        this.logger = new Loggyslav(targetsConfiguration, loggerConfiguration);
    }

    protected before() {
        this.sandbox = sinon.sandbox.create();
    }

    protected after() {
        this.sandbox.restore();
        this.logger.disable();
    }

    @test
    private "Should not change class instance on simpleClass when logger is initialized"() {
        const methodLogger = new SimpleMethodLoggyslav();
        const logDataConfiguration: TargetsConfiguration = this.getDefaultLogDataConfiguration();
        const loggerConfiguration = {
            methodLogger,
        };
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        const spy = this.sandbox.spy(methodLogger, "logMethodCall");

        const simpleClass = new SimpleClass();
        simpleClass.simpleMethod();
        expect(simpleClass).instanceof(SimpleClass);
    }

    @test
    private "Should call method logMethodCall once when logger is initialized and simpleMethod is called"() {
        const methodLogger = new SimpleMethodLoggyslav();
        const logDataConfiguration: TargetsConfiguration = this.getDefaultLogDataConfiguration();
        const loggerConfiguration = {
            methodLogger,
        };
        const spy = this.sandbox.spy(methodLogger, "logMethodCall");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        const simpleClass = new SimpleClass();
        simpleClass.simpleMethod();

        expect(spy.callCount).equals(1);
    }

    @test
    private "Should call method logInput with params 2, 3 once when logger is initialized and sumTwoNumbers is called"() {
        const methodLogger = new SimpleMethodLoggyslav();
        const logDataConfiguration = this.getDefaultLogDataConfiguration();
        const loggerConfiguration = {
            methodLogger,
        };
        const spy = this.sandbox.spy(methodLogger, "logMethodCall");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        const simpleClass = new SimpleClass();
        simpleClass.sumTwoNumbers(2, 3);

        const firstTimeCalled = spy.args[0];
        expect(firstTimeCalled, LoggyslavTest.EXPECT_MESSAGE.AT_LEAST_ONCE).not.undefined;
        const firstInputParam: LoggerParams = firstTimeCalled[0];

        const params: number[] = firstInputParam.inputParams;
        const className: string | undefined = firstInputParam.className;
        const methodName: string = firstInputParam.propertyName;

        expect(params, LoggyslavTest.EXPECT_MESSAGE.INPUT_PARAMS).deep.equals([2, 3]);
        expect(className, LoggyslavTest.EXPECT_MESSAGE.CLASS_NAME).equals("SimpleClass");
        expect(methodName, LoggyslavTest.EXPECT_MESSAGE.METHOD_NAME).equals("sumTwoNumbers");
    }

    @test
    private "Should call logInput once when calling simpleMethod from some other class"() {
        const someClass = new SomeOtherClass();
        const methodLogger = new SimpleMethodLoggyslav();
        const logDataConfiguration = this.getDefaultLogDataConfiguration();
        const loggerConfiguration = {
            methodLogger,
        };
        const spy = this.sandbox.spy(methodLogger, "logMethodCall");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        someClass.callSimpleMethod();

        expect(spy.callCount).equals(1);
    }

    @test
    private "Should not call logInput when class SimpleMethod logs non of methods"() {
        const someClass = new SomeOtherClass();
        const methodLogger = new SimpleMethodLoggyslav();
        const logDataConfiguration: TargetsConfiguration = {
            targets: [
                {
                    classType: SimpleClass,
                    methods: [],
                    properties: [],
                },
            ],
        };
        const loggerConfiguration = {
            methodLogger,
        };
        const spy = this.sandbox.spy(methodLogger, "logMethodCall");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        someClass.callSimpleMethod();

        expect(spy.callCount).equals(0);
    }

    @test
    private "Should call logMethodCall second time (setter) with expected params when setA is called"() {
        const someClass = new SimpleClass();
        const methodLogger = new SimpleMethodLoggyslav();
        const propertyLogger = new PropertyLogger();
        const logDataConfiguration: TargetsConfiguration = {
            targets: [
                {
                    classType: SimpleClass,
                    methods: [],
                    properties: [
                        "a",
                    ],
                },
            ],
        };
        const loggerConfiguration = {
            methodLogger,
            propertyLogger,
        };
        const spy = this.sandbox.spy(propertyLogger, "logPropertyChange");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        someClass.setA(5);
        expect(spy.args.length, LoggyslavTest.EXPECT_MESSAGE.AT_LEAST_ONCE).equals(1);

        const firstTimeCalled = spy.args[0];
        const firstInputParam: LoggerParams = firstTimeCalled[0];

        const params: number[] = firstInputParam.inputParams;
        const className: string | undefined = firstInputParam.className;
        const propertyName: string = firstInputParam.propertyName;
        const type: string | undefined = firstInputParam.type;

        expect(params, LoggyslavTest.EXPECT_MESSAGE.INPUT_PARAMS).deep.equals([5]);
        expect(className, LoggyslavTest.EXPECT_MESSAGE.CLASS_NAME).deep.equals("SimpleClass");
        expect(propertyName, LoggyslavTest.EXPECT_MESSAGE.PROPERTY_NAME).deep.equals("a");
        expect(type, LoggyslavTest.EXPECT_MESSAGE.TO_BE_PROPERTY).deep.equals(LoggerParamsType.PROPERTY);
    }

    @skip
    @test
    private "Should call logMethodCall with expected params twice (second time has to be getter) when setA is called"() {
        const someClass = new SimpleClass();
        const methodLogger = new SimpleMethodLoggyslav();
        const propertyLogger = new PropertyLogger();
        const logDataConfiguration: TargetsConfiguration = {
            targets: [
                {
                    classType: SimpleClass,
                    methods: [],
                    properties: [
                        "a",
                    ],
                },
            ],
        };
        const loggerConfiguration = {
            methodLogger,
            propertyLogger,
        };
        const spy = this.sandbox.spy(propertyLogger, "logPropertyChange");
        this.initNewLogger(logDataConfiguration, loggerConfiguration);

        // class logic first trigger setter, then trigger getter logger
        someClass.setA(5);
        const a = someClass.a;

        expect(spy.args.length, LoggyslavTest.EXPECT_MESSAGE.AT_LEAST_TWICE).equals(2);

        const secondTimeCalled = spy.args[1];
        const firstInputParam: LoggerParams = secondTimeCalled[0];

        const params: number[] = firstInputParam.inputParams;
        const className: string | undefined = firstInputParam.className;
        const propertyName: string = firstInputParam.propertyName;
        const type: string | undefined = firstInputParam.type;

        expect(params, LoggyslavTest.EXPECT_MESSAGE.INPUT_PARAMS).deep.equals([]);
        expect(className, LoggyslavTest.EXPECT_MESSAGE.CLASS_NAME).deep.equals("SimpleClass");
        expect(propertyName, LoggyslavTest.EXPECT_MESSAGE.PROPERTY_NAME).deep.equals("a");
        expect(type, LoggyslavTest.EXPECT_MESSAGE.TO_BE_PROPERTY).deep.equals(LoggerParamsType.PROPERTY);
    }

    @test
    private "Should call logError when method throws an error"() {

        const methodLogger = new SimpleMethodLoggyslav();
        const winstonErrorLogger = new SimpleErrorLoggyslav();
        const targetsConfiguration: TargetsConfiguration = {
            targets: [
                {
                    classType: SimpleClass,
                    methods: ["throwError"],
                },
            ],
        };
        const loggerConfiguration: LoggerConfiguration = {
            methodLogger,
            errorLogger: winstonErrorLogger,
        };

        this.initNewLogger(targetsConfiguration, loggerConfiguration);

        const simpleClass = new SimpleClass();
        const spy = this.sandbox.spy(winstonErrorLogger, "error");

        try {
            simpleClass.throwError();
        } catch (e) {
        }

        expect(spy.callCount, "Expect to be called once").equals(1);

        const firstCallArgs = spy.args[0];

        expect(firstCallArgs).deep.equal([`${SimpleClass.errorMsg}`]);
    }
}
