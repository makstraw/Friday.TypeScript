/// <reference path="../../Friday.Base/Exceptions/Basic/Exception.ts" />
namespace Friday.Exceptions {
    export class ExceptionToNoticeTransformationFunctionNotAssigned extends Exception {
        constructor() {
            super(String.Empty);
        }
    }
}