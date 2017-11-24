///<reference path="Stream.ts"/>
namespace Friday.Audio {
    import WritableStream = Streams.WritableStream
    export class AudioStream extends WritableStream<Float32Array> {
        private ctx: AudioContext;
        private readonly bufferSize: number = 800;
        private processorNode: ScriptProcessorNode;
        private inputNode: AudioBufferSourceNode;
        private shuttingDown = false;
        private shutDown = false;
        private currentBuffer = null;
        private currentBufferOffset: number;
        private readonly channelsCount = 1;

        constructor(ctx: AudioContext) {
            super();
            this.ctx = ctx;
            this.processorNode = ctx.createScriptProcessor(this.bufferSize, 0, this.channelsCount);
            this.inputNode = ctx.createBufferSource();
            this.inputNode.loop = true;

            this.processorNode.addEventListener("audioprocess",this.AudioProcessHandle.bind(this));

        }

        public AudioProcessHandle(ev: AudioProcessingEvent) {
            if (this.shutDown) return;
            const out = ev.outputBuffer;
            let outOffset = 0;
            while (outOffset < out.length) {
                if (!this.currentBuffer && this.queue.length > 0) {
                    this.currentBuffer = this.queue.shift();
                    this.currentBufferOffset = 0;
                }
                if (!this.currentBuffer) {
                    for (let channel = 0; channel < this.channelsCount; channel++) {
                        out.getChannelData(channel).fill(0, outOffset);
                    }
                    if (this.shuttingDown) {
                        this.shutDown = true;
                        // CLOSE
                    }
                    break;
                }
                const remainingOutput = out.length - outOffset;
                const remainingInput = this.currentBuffer.length - this.currentBufferOffset;
                const remaining = Math.min(remainingOutput, remainingInput);

                this.currentBuffer.copyTo(out, outOffset, this.currentBufferOffset, remaining);
                this.currentBufferOffset += remaining;
                outOffset += remaining;
                if (this.currentBufferOffset >= this.currentBuffer.length) {
                    this.currentBuffer = null;
                }
            }
        }

        public Connect(destinatiion: AudioDestinationNode) {
            this.inputNode.connect(this.processorNode);
            this.inputNode.start();
            this.processorNode.connect(destinatiion);

        }

        public Disconnect(destinatiion: AudioDestinationNode) {
            this.processorNode.disconnect(destinatiion);
        }
    }
}