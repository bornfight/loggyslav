export class SimpleClass {
    public static errorMsg = "This is a simple error";
    public a: number;

    public simpleMethod(): void {
        this.a = 0;
        return;
    }

    public sumTwoNumbers(a: number, b: number): number {
        return a + b;
    }

    public setA(a: number): void {
        this.a = a;
    }

    public throwError() {
        throw new Error(SimpleClass.errorMsg);
    }
}
