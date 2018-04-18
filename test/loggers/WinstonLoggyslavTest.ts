/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
/* tslint:disable:no-dead-store */
import * as chai from "chai";
import {
    suite, test,
} from "mocha-typescript";
import {SinonSandbox} from "sinon";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");
import * as winston from "winston";
import {LogDataConfiguration, LoggerConfiguration, Loggyslav} from "../../src";
import {WinstonLoggyslav} from "../../src/loggers/WinstonLoggyslav";
import {SimpleClass} from "../stubs/SimpleClass";

const expect = chai.expect;

chai.use(sinonChai);

@suite("WinstonLoggyslav")
export class WinstonLoggyslavTest {
    protected sandbox: SinonSandbox;

    protected before() {
        this.sandbox = sinon.sandbox.create();
    }

    protected after() {
        this.sandbox.restore();
    }

    @test
    private "Should call WinstonLogger with expected args when initialized as method logger"() {
        const winstonNewLogger = new winston.Logger( {
            level: "info",
            transports: [
                new winston.transports.Console(),
            ],
        } );
        const winstonLogger = new WinstonLoggyslav(winstonNewLogger);

        const classConfiguration: LogDataConfiguration = {
            classes: [
                {
                    classType: SimpleClass,
                },
            ],
        };
        const loggerConfiguration: LoggerConfiguration = {
            methodLogger: winstonLogger,
        };

        const loggyslav = new Loggyslav(
            classConfiguration,
            loggerConfiguration,
        );

        const simpleClass = new SimpleClass();
        const spy = sinon.spy(winstonLogger, "log");

        simpleClass.sumTwoNumbers(5, 3);

        expect(spy.callCount, "Expect to be called once").equals(1);

        const firstCallArgs = spy.args[0];

        expect(firstCallArgs).deep.include([5, 3]);
    }
}
