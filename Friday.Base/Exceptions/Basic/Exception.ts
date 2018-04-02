namespace Friday.Exceptions {
    export class Exception {
        private readonly message: string;

        constructor(message: string) {
            this.message = message;
        }

        public toString(): string {
            return "Exception: " + this.message;
        }
    }
}