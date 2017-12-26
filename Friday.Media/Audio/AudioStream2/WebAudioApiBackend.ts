namespace Friday.AudioLib {
    export class WebAudioApiBackend {
        public OnStarved: Function;
        public OnBufferLow: Function;

        private sharedAudioContext: AudioContext;

        private _context: AudioContext;
        private output: AudioNode;
        public readonly Rate: number;
        public readonly Channels: number;
        public readonly BufferSize: AudioStreamBufferSize = 4096;
        public BufferThreshold: number;

        private readonly _bufferQueue: BufferQueue;

        private _playbackTimeAtBufferTail: number;
        private _queuedTime: number;
        private _delayedTime: number;
        private _dropped: number;
        private _liveBuffer: SampleBuffer;
        private _node: ScriptProcessorNode;

        public Volume: number = 1;
        public Mute: boolean = false;

        constructor(numChannels: number, sampleRate: number, options: IWebAudioApiBackendOptions) {
            this._context = options.Context || this.initSharedAudioContext();
            this.output = options.Destination || this._context.destination;
            this.Rate = this._context.sampleRate;
            this.Channels = numChannels;
            if (options.BufferSize) {
                this.BufferSize = options.BufferSize;
            }
            this.BufferThreshold = this.BufferSize * 2;

            this._bufferQueue = new BufferQueue(this.Channels, this.BufferSize);
            this._playbackTimeAtBufferTail = this._context.currentTime;
            this._queuedTime = 0;
            this._delayedTime = 0;
            this._dropped = 0;
            this._liveBuffer = this._bufferQueue.CreateBuffer(this.BufferSize);
            this._node = this._context.createScriptProcessor(this.BufferSize, 0, this.Channels);
        }

        public Clear() {
            this._bufferQueue.Clear();
            this._queuedTime = 0;
            this._delayedTime = 0;
            this._dropped = 0;
        }

        private audioProcess(event: AudioProcessingEvent) {
            var channel: number;
            var input: Float32Array;
            var output: Float32Array;
            var i: number;


            var expectedTime = this._playbackTimeAtBufferTail;
            if (expectedTime < event.playbackTime) {
                // we may have lost some time while something ran too slow
                this._delayedTime += (event.playbackTime - expectedTime);
            }

            if (this._bufferQueue.SampleCount() < this.BufferSize) {
                // We might be in a throttled background tab; go ping the decoder
                // and let it know we need more data now!
                // @todo use standard event firing?
                if (this.OnStarved) {
                    this.OnStarved();
                }
            }

            // If we still haven't got enough data, write a buffer of silence
            // to all channels and record an underrun event.
            // @todo go ahead and output the data we _do_ have?
            if (this._bufferQueue.SampleCount() < this.BufferSize) {
                for (channel = 0; channel < this.Channels; channel++) {
                    output = event.outputBuffer.getChannelData(channel);
                    for (i = 0; i < this.BufferSize; i++) {
                        output[i] = 0;
                    }
                }
                this._dropped++;
                return;
            }


            // Actually get that data and write it out...
            var inputBuffer = this._bufferQueue.NextBuffer();
            if (inputBuffer[0].length < this.BufferSize) {
                // This should not happen, but trust no invariants!
                throw 'Audio buffer not expected length.';
            }
            for (channel = 0; channel < this.Channels; channel++) {
                input = inputBuffer[channel];

                // Save this buffer data for later in case we pause
                this._liveBuffer[channel].set(inputBuffer[channel]);

                // And play it out with volume applied...
                output = event.outputBuffer.getChannelData(channel);
                for (i = 0; i < input.length; i++) {
                    if (this.Mute) output[i] = 0;
                    else output[i] = input[i] * this.Volume;
                }
            }
            this._queuedTime += (this.BufferSize / this.Rate);
            this._playbackTimeAtBufferTail = event.playbackTime + (this.BufferSize / this.Rate);

            if (this._bufferQueue.SampleCount() < Math.max(this.BufferSize, this.BufferThreshold)) {
                // Let the decoder know ahead of time we're running low on data.
                // @todo use standard event firing?
                if (this.OnBufferLow) {
                    //nextTick(this.OnBufferLow.bind(this));
                }
            }
        }

        private samplesQueued(): number {
            var bufferedSamples = this._bufferQueue.SampleCount();
            var remainingSamples = Math.floor(this.timeAwaitingPlayback() * this.Rate);

            return bufferedSamples + remainingSamples;
        }

        private timeAwaitingPlayback(): number {
            return Math.max(0, this._playbackTimeAtBufferTail - this._context.currentTime);
        }

        public GetPlaybackState() : IPlaybackState {
            return {
                PlaybackPosition: this._queuedTime - this.timeAwaitingPlayback(),
                SamplesQueued: this.samplesQueued(),
                Dropped: this._dropped,
                Delayed: this._delayedTime
            };
        }

        public AppendBuffer(sampleData: SampleBuffer) {
            this._bufferQueue.AppendBuffer(sampleData);
        }

        public Start() {
            this._node.onaudioprocess = this.audioProcess.bind(this);
            this._node.connect(this.output);
            this._playbackTimeAtBufferTail = this._context.currentTime;
        }

        public Stop() {
            if (this._node) {
                var timeRemaining = this.timeAwaitingPlayback();
                if (timeRemaining > 0) {
                    // We have some leftover samples that got queued but didn't get played.
                    // Unshift them back onto the beginning of the buffer.
                    // @todo make this not a horrible hack
                    var samplesRemaining = Math.round(timeRemaining * this.Rate),
                        samplesAvailable = this._liveBuffer ? this._liveBuffer[0].length : 0;
                    if (samplesRemaining > samplesAvailable) {
                        //console.log('liveBuffer size ' + samplesRemaining + ' vs ' + samplesAvailable);
                        this._bufferQueue.PrependBuffer(this._liveBuffer);
                        this._bufferQueue.PrependBuffer(
                            this._bufferQueue.CreateBuffer(samplesRemaining - samplesAvailable));
                    } else {
                        this._bufferQueue.PrependBuffer(
                            this._bufferQueue.TrimBuffer(this._liveBuffer, samplesAvailable - samplesRemaining, samplesRemaining));
                    }
                    this._playbackTimeAtBufferTail -= timeRemaining;
                }
                this._node.onaudioprocess = null;
                this._node.disconnect();
            }
        }

        public Flush() {
            this._bufferQueue.Flush();
        }

        public Close() {
            this.Stop();
            this._context = null;
        }

        private initSharedAudioContext(): AudioContext {
            if (!this.sharedAudioContext) {
                var context = new AudioContext();
                var node = context.createScriptProcessor(1024, 0, 2);
                node.disconnect();
                this.sharedAudioContext = context;
            }
            return this.sharedAudioContext;
        }
    }
}