/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
/* tslint:disable:no-dead-store */
/* tslint:disable:no-empty */
import * as chai from "chai";
import {
    suite, test,
} from "mocha-typescript";
import {SinonSandbox} from "sinon";
import * as sinon from "sinon";
import sinonChai = require("sinon-chai");
import * as winston from "winston";
import {LoggerConfiguration, Loggyslav, TargetsConfiguration} from "../../src";
import {WinstonLoggyslav} from "../../src/loggers/WinstonLoggyslav";
import {SimpleClass} from "../stubs/SimpleClass";

const expect = chai.expect;

chai.use(sinonChai);

@suite("WinstonLoggyslav")
export class WinstonLoggyslavTest {
    protected sandbox: SinonSandbox;
    protected logger: Loggyslav;

    protected before() {
        this.sandbox = sinon.sandbox.create();
    }

    protected after() {
        this.sandbox.restore();
        this.logger.disable();
    }

    protected initNewLogger(targetsConfiguration: TargetsConfiguration, loggerConfiguration: LoggerConfiguration) {
        this.logger = new Loggyslav(targetsConfiguration, loggerConfiguration);
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
        const targetsConfiguration: TargetsConfiguration = {
            targets: [
                {
                    classType: SimpleClass,
                },
            ],
        };
        const loggerConfiguration: LoggerConfiguration = {
            methodLogger: winstonLogger,
        };

        this.initNewLogger(targetsConfiguration, loggerConfiguration);

        const simpleClass = new SimpleClass();
        const spy = this.sandbox.spy(winstonLogger, "log");

        simpleClass.sumTwoNumbers(5, 3);

        expect(spy.callCount, "Expect to be called once").equals(1);

        const firstCallArgs = spy.args[0];

        expect(firstCallArgs).deep.include([5, 3]);
    }
}
