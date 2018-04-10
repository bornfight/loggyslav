/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
import * as assert from "assert";
import * as chai from "chai";
import {
    suite, test,
} from "mocha-typescript";
import sinonChai = require("sinon-chai");

const expect = chai.expect;

chai.use(sinonChai);

@suite("Example")
export class ExampleTest {

    @test
    private "Should be ok!"() {
        assert(true);
    }
}
