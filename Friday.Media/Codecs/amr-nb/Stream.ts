namespace Friday.Streams {
    export class WritableStream<T> {
        protected queue: Array<T> = [];

        public Write(chunk: T) {
            this.queue.push(chunk);
        }
    }
}