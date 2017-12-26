namespace Friday.AudioLib {

    export class BufferQueue {
        private channels: number;
        private bufferSize: number;

        private _buffers: Array<SampleBuffer>;
        private _pendingBuffer: SampleBuffer;
        private _pendingPos: number;

        constructor(numChannels: number, bufferSize: number) {
            if (numChannels < 1 || numChannels !== Math.round(numChannels)) {
                throw 'Invalid channel count for BufferQueue';
            }
            this.channels = numChannels;
            this.bufferSize = bufferSize;
            this.Flush();
        }

        public Flush() : void{
            this._buffers = [];
            this._pendingBuffer = this.CreateBuffer(this.bufferSize);
            this._pendingPos = 0;
        }

        public SampleCount(): number {
            var count = 0;
            this._buffers.forEach((buffer: SampleBuffer) => {
                count += buffer[0].length;
            });
            return count;
        }

        public Clear() {
            this._buffers = [];
        }

        public CreateBuffer(sampleCount: number): SampleBuffer {
            var output: SampleBuffer = [];
            for (var i = 0; i < this.channels; i++) {
                output[i] = new Float32Array(sampleCount);
            }
            return output;
        }

        private validate(buffer: SampleBuffer): boolean {
            if (buffer.length !== this.channels) {
                return false;
            }

            var sampleCount: number;
            for (var i = 0; i < buffer.length; i++) {
                var channelData = buffer[i];
                if (!(channelData instanceof Float32Array)) {
                    return false;
                }
                if (i == 0) {
                    sampleCount = channelData.length;
                } else if (channelData.length !== sampleCount) {
                    return false;
                }
            }

            return true;
        }

        public AppendBuffer(sampleData: SampleBuffer) {
            if (!this.validate(sampleData)) {
                throw "Invalid audio buffer passed to BufferQueue.appendBuffer";
            }

            var firstChannel = sampleData[0],
                sampleCount = firstChannel.length;

            // @todo this seems hella inefficient
            for (var i = 0; i < sampleCount; i++) {
                for (var channel = 0; channel < this.channels; channel++) {
                    this._pendingBuffer[channel][this._pendingPos] = sampleData[channel][i];
                }
                if (++this._pendingPos == this.bufferSize) {
                    this._buffers.push(this._pendingBuffer);
                    this._pendingPos = 0;
                    this._pendingBuffer = this.CreateBuffer(this.bufferSize);
                }
            }

        }

        public PrependBuffer(sampleData: SampleBuffer) {
            if (!this.validate(sampleData)) {
                throw "Invalid audio buffer passed to BufferQueue.prependBuffer";
            }

            // Since everything is pre-chunked in the queue, we're going to have
            // to pull everything out and re-append it.
            var buffers = this._buffers.slice(0);
            buffers.push(this.TrimBuffer(this._pendingBuffer, 0, this._pendingPos));

            this.Flush();
            this.AppendBuffer(sampleData);

            // Now put back any old buffers, dividing them up into chunks.
            for (var i = 0; i < buffers.length; i++) {
                this.AppendBuffer(buffers[i]);
            }
        }

        public NextBuffer(): SampleBuffer {
            if (this._buffers.length) {
                return this._buffers.shift();
            } else {
                var trimmed = this.TrimBuffer(this._pendingBuffer, 0, this._pendingPos);
                this._pendingBuffer = this.CreateBuffer(this.bufferSize);
                this._pendingPos = 0;
                return trimmed;
            }
        }

        public TrimBuffer(sampleData: SampleBuffer, start: number, maxSamples: number): SampleBuffer {
            var bufferLength = sampleData[0].length,
                end = start + Math.min(maxSamples, bufferLength);
            if (start == 0 && end >= bufferLength) {
                return sampleData;
            } else {
                var output: SampleBuffer = [];
                for (var i = 0; i < this.channels; i++) {
                    output[i] = sampleData[i].subarray(start, end);
                }
                return output;
            }
        }
    }
}