namespace Friday.Utility {
    export class EventHandler<T> {
        private handlers: Array<Function> = [];

        public Subscribe(arg: Function) {
            this.handlers.push(arg);
        }

        public Unsubscribe(arg: Function) {
            for (let i = 0; i < this.handlers.length; i++) {
                if (this.handlers[i] == arg) this.handlers.splice(i, 1);
            }
        }

        public Call(arg?: T) {
            for (let i = 0; i < this.handlers.length; i++) {
                if (typeof arg != "undefined") this.handlers[i](arg);
                else this.handlers[i]();
            }
        }
    }
}