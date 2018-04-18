/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
/* tslint:disable:max-classes-per-file */
import * as assert from "assert";
import * as chai from "chai";
import {
    only, suite, test,
} from "mocha-typescript";
import * as sinon from "sinon";
import {SinonSandbox} from "sinon";
import sinonChai = require("sinon-chai");
import {SimpleMethodLoggyslav} from "../../../src/core/loggers/SimpleMethodLoggyslav";
import {LoggerParams, LoggerParamsType} from "../../../src/interfaces/LoggerInterface";

const expect = chai.expect;

chai.use(sinonChai);

@suite("SimpleMethodLoggyslav")
export class MethodLoggerTest {
    protected methodLoggerClass: (new () =>  SimpleMethodLoggyslav);
    protected methodLogger: SimpleMethodLoggyslav;
    protected sandbox: SinonSandbox;

    protected getDefaultLoggerInputLogParams(): LoggerParams {
        const inputParams = this.getDefaultInputParams();
        const outputValue = this.getDefaultOutputValue();

        return {
            propertyName: "MethodName",
            type: LoggerParamsType.METHOD,
            inputParams,
            outputValue,
            startTimestamp: 100,
            endTimestamp: 100,
        };
    }

    protected getDefaultInputParams(): any[] {
        return [1, 2];
    }

    protected getDefaultOutputValue(): number {
        return 5;
    }

    protected before() {
        this.sandbox = sinon.sandbox.create();
        this.methodLoggerClass = SimpleMethodLoggyslav;
        this.methodLogger = new this.methodLoggerClass();
    }

    protected after() {
        this.sandbox.restore();
    }

    @test
    private "Should have expected log format when logMethodCall is called"() {
        const inputParams = this.getDefaultInputParams();
        const outputValue = this.getDefaultOutputValue();
        const logInputParams = this.getDefaultLoggerInputLogParams();
        const expectedLogArgs = [
            "Method: MethodName",
            "Type: METHOD",
            "Start: 100",
            "End: 100",
            "Params: ",
            inputParams,
            "Output: ",
            outputValue,
        ];
        const spy = this.sandbox.spy(this.methodLogger, "log");

        this.methodLogger.logMethodCall( logInputParams );
        expect(spy.args).deep.equals([expectedLogArgs]);
    }
}
