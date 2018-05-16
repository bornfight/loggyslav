/* tslint:disable:no-unused-expression */
/* tslint:disable:max-line-length */
/* tslint:disable:max-targets-per-file */
/* tslint:disable:max-classes-per-file */
import * as chai from "chai";
import {
    suite, test,
} from "mocha-typescript";
import sinonChai = require("sinon-chai");
import {ClassExtractHelper} from "../../src/helpers/ClassExtractHelper";

const expect = chai.expect;

chai.use(sinonChai);

@suite("ClassExtractHelper")
export class ClassExtractHelperTest {
    @test
    private "Should return all methods"() {
        const methods = ClassExtractHelper.getClassMethods(SomeTestClass);
        expect(methods).deep.equals(
            [
                "constructor",
                "method1",
                "method2",
            ],
        );
    }

    @test
    private "Should return expected class name"() {
        expect(ClassExtractHelper.getClassName(SomeTestClass)).equals("SomeTestClass");
    }
}

class SomeTestClass {
    public method1(): boolean {
        return true;
    }
    public method2(): boolean {
        return true;
    }
}
