///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class NotImplementedException extends Exception {
        constructor(methodName: string) {
            super("Method '" + methodName + "' is not implemented");
        }
    }
}