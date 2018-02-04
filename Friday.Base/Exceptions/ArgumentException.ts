///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class ArgumentException extends Exception {
        constructor(argumentName: string) {
            super("Argument '" + argumentName + "' is invalid");
        }
    }
}