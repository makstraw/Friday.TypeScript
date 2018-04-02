/// <reference path="../../Friday.Base/Exceptions/Basic/Exception.ts" />
namespace Friday.Exceptions {
    export class InvalidWidgetArguments extends Exception {
        constructor() {
            super("One or more arguments of widget in wizard is invalid");
        }
    }
}