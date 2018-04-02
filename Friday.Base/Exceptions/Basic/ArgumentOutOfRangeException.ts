///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class ArgumentOutOfRangeException extends Exception {
        constructor(argumentName: string) {
            super("Argument '" + argumentName + "' out of range");
        }
    }
}