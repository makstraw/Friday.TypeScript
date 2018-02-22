///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class ArgumentCountException extends Exception {
        constructor(argumentCount: string) {
            super("Argument count '" + argumentCount + "' is invalid");
        }
    }
}