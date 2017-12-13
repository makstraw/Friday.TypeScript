namespace Friday.Streams {

    export interface IBufferChunk<T> {
        buffer: T;
        offset: number;
    }

    export class WritableStream<T> {
        protected queue: Array<IBufferChunk<T>> = [];

        public Write(chunk: T, offset: number) {
            this.queue.push({buffer: chunk, offset: offset});
        }

        public Clear() {
            this.queue = [];
        }
    }
}