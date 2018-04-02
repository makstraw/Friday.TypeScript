///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class OverflowException extends Exception {
        constructor() {
            super("In process of execution, undesirable overflow occurs");
        }
    }
}