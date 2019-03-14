///<reference path="Exception.ts"/>
namespace Friday.Exceptions {
    export class UnsupportedBrowserException extends Exception {
        constructor() {
            super(navigator.userAgent);
        }
    }
}