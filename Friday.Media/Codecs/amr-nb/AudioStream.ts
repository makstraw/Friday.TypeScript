///<reference path="Stream.ts"/>
namespace Friday.Audio {
    import WritableStream = Streams.WritableStream

    export class AudioStream extends WritableStream<Float32Array> {
        private ctx: AudioContext;
        private readonly sampleRate: number = 8000;
        private readonly bufferSize: number = 16384;
        private processorNode: ScriptProcessorNode;
        private inputNode: AudioBufferSourceNode;
        private shuttingDown = false;
        private shutDown = false;
        private currentBuffer: Float32Array = null;
        private currentBufferOffset: number;
        private readonly channelsCount = 1;
        private readonly interleaved = true;

        constructor(ctx: AudioContext) {
            super();
            this.ctx = ctx;
            this.processorNode = ctx.createScriptProcessor(this.bufferSize, 0, this.channelsCount);
            this.inputNode = ctx.createBufferSource();
            this.inputNode.playbackRate.value = 0.2;
            this.inputNode.loop = true;

            this.processorNode.addEventListener("audioprocess",this.AudioProcessHandle.bind(this));

        }

//        private _bulkCopy(to: AudioBuffer, toOffset, fromOffset, length) {
//            to.set(this._it.subarray(fromOffset, fromOffset + length), toOffset)
//        }

        private copyTo(from: Float32Array, to: AudioBuffer, toOffset: number, fromOffset: number, length: number) {
            for (let channel = 0; channel < this.channelsCount; channel++) {
                const actualFromOffset = from.byteLength * channel + fromOffset
                const channelData = to.getChannelData(channel)
                channelData.set(from.subarray(actualFromOffset,fromOffset+length),toOffset);
//                this._bulkCopy(channelData, toOffset, actualFromOffset, length)
//
//
//                    for (let i = 0; i < length; i++) {
//                        const actualFromOffset = (fromOffset + i) * this.channelsCount + channel;
//                        channelData[toOffset + i] = from[i];
//                    }
            }
            
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
                this.copyTo(this.currentBuffer, out, outOffset, this.currentBufferOffset, remaining);
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