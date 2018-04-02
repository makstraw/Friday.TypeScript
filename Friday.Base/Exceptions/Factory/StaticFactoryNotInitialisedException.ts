namespace Friday.Exceptions {
    export class StaticFactoryNotInitialisedException extends Exception {
        constructor() {
            super("Static factory not initialised properly");
        }
    }
}