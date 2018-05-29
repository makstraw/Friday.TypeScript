namespace Friday.Utility {
    export class EventHandler<T> {
        private handlers: Array<Function> = [];
        private disposableHandlers: Array<Function> = [];
        private readonly invokeOnSubscribeHandler: Function;

        public Subscribe(arg: Function): Function {
            this.handlers.push(arg);
            if (typeof this.invokeOnSubscribeHandler === "function" && this.invokeOnSubscribeHandler()) arg();
            return arg;
        }

        public SubscribeOnce(arg: Function): Function {
            this.disposableHandlers.push(arg);
            if (typeof this.invokeOnSubscribeHandler === "function" && this.invokeOnSubscribeHandler()) arg();
            return arg;
        }

        public Unsubscribe(arg: Function) {
            for (let i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i] == arg) this.handlers.splice(i, 1);
            }
        }

        public UnsubscribeAll() {
            this.handlers = [];
        }

        public Call(arg?: T) {
            for (let i = 0; i < this.handlers.length; i++) {
                if (typeof arg != "undefined") this.handlers[i](arg);
                else this.handlers[i]();
            }
            while (this.disposableHandlers.length > 0) {
                let handler = this.disposableHandlers.pop();
                if (typeof arg != "undefined") handler(arg);
                else handler();
            }
        }

        public Invoke = this.Call;

        constructor(invokeOnSubscribeHandler?: Function) {
            if (typeof invokeOnSubscribeHandler === "function")
                this.invokeOnSubscribeHandler = invokeOnSubscribeHandler;
        }
    }
}