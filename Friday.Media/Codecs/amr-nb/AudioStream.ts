///<reference path="Stream.ts"/>
namespace Friday.AudioLib {
    import WritableStream = Streams.WritableStream

    

    export class AudioStream extends WritableStream<Float32Array> {
        public BufferOffset : number = 0;
        private ctx: AudioContext;
        private readonly sampleRate: number = 8000;
        private readonly bufferSize: AudioStreamBufferSize;
        private processorNode: ScriptProcessorNode;
        private inputNode: AudioBufferSourceNode;
        private shuttingDown = false;
        private shutDown = false;
        private currentBuffer: Float32Array = null;
        private currentBufferOffset: number;
        private readonly channelsCount = 1;
        private readonly interleaved = true;

        constructor(ctx: AudioContext, bufferSize: AudioStreamBufferSize = 4096) {
            super();
            this.ctx = ctx;
            this.bufferSize = bufferSize;
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
            }
            
        }

        private fadeOut(buffer: AudioBuffer) {
            const ms = 15;
            const bitsPerSample = 16;
            const kbps = this.ctx.sampleRate * bitsPerSample / 8;
            const bytes = kbps * ms / 1000;
//            console.log(`SampeRate: ${this.ctx.sampleRate}, Ms: ${ms}, bitsPerSample: ${bitsPerSample}, kbps: ${kbps}, byte: ${bytes}`);
            const channelData = buffer.getChannelData(0);
            for (let i = bytes; i > 0; i--) {
                let amplitude = i / bytes;
                if(amplitude < 0.1) amplitude = 0.1;
                channelData[channelData.length - i] = channelData[channelData.length - i] * amplitude;
            }
            for (let i = 0; i <= bytes; i++) {
                let amplitude = i / bytes;
                if (amplitude < 0.1) amplitude = 0.1;
                channelData[i] = channelData[i] * amplitude;
            }
        }

        public AudioProcessHandle(ev: AudioProcessingEvent) {
            if (this.shutDown) return;
            const out = ev.outputBuffer;
            
            let outOffset = 0;

            while (outOffset < out.length) {

                if (!this.currentBuffer && this.queue.length > 0) {
                    var chunk = this.queue.shift();
                    this.currentBuffer = chunk.buffer;
                    this.BufferOffset = chunk.offset;
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
//                this.fadeOut(out);
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