import {ClassType} from "../core/Logger";

export class ClassExtractHelper {

    public static getClassName(target: { new(): any }): string {
        return target.prototype.constructor.name;
    }
    public static getClassMethods(classType: ClassType) {
        const methods: string[] = [];

        const filterMethods = [
            "__defineGetter__",
            "__defineSetter__",
            "hasOwnProperty",
            "__lookupGetter__",
            "__lookupSetter__",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toString",
            "valueOf",
            "toLocaleString",
        ];

        if (classType.prototype) {
            const propertyNames = Object.getOwnPropertyNames(classType.prototype);

            propertyNames.forEach((name: string) => {
                if (!(classType.prototype[name] instanceof Function)) {
                    return;
                }

                methods.push(name);
            });
        }

        return methods.filter((methodName: string) => {
            return filterMethods.indexOf(methodName) === -1;
        });
    }
}
