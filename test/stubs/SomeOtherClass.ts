import {SimpleClass} from "./SimpleClass";

export class SomeOtherClass {
    public callSimpleMethod(): void {
        const simpleClass = new SimpleClass();
        simpleClass.simpleMethod();
    }
}
