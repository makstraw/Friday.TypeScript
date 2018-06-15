///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class NotInitializedException extends Exception {
        constructor(className: string) {
            super("Class '" + className + "' is not initialized properly");
        }
    }
}