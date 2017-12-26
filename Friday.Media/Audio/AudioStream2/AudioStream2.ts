namespace Friday.AudioLib {

    export class AudioStream2 {
        public OnStarved: Function;
        public OnBufferLow: Function;

        private _backend: WebAudioApiBackend;
        private readonly rate: number = 0;
        private readonly targetRate: number = 0;
        private readonly channels: number = 0;
        private readonly bufferSize: number = 0;

        public get volume(): number {
            return this._backend.Volume;
        }

        public set volume(value: number) {
            if (value < 0) value = 0;
            if (value > 1) value = 1;
            this._backend.Volume = value;
        }

        public get mute(): boolean {
            return this._backend.Mute;
        }

        public set mute(value: boolean) {
            this._backend.Mute = value;
        }

        private get bufferDuration() : number {
            if (this.targetRate) {
                return this.bufferSize / this.targetRate;
            } else {
                return 0;
            }
        }

        public get bufferThreshold(): number {
            if (this._backend) {
                return this._backend.BufferThreshold / this.targetRate;
            } else {
                return 0;
            }
        }

        public set bufferThreshold(value: number) {
            if (this._backend) {
                this._backend.BufferThreshold = Math.round(value * this.targetRate);
            } else {
                throw 'Invalid state: AudioFeeder cannot set bufferThreshold before init';
            }
        }

        public get playbackPosition(): number {
            if (this._backend) {
                var playbackState = this.getPlaybackState();
                return playbackState.PlaybackPosition;
            } else {
                return 0;
            }
        }

        public get getDurationBuffered(): number {
            if (this._backend) {
                var playbackState = this.getPlaybackState();
                return playbackState.SamplesQueued / this.targetRate;
            } else {
                return 0;
            }
        }


        constructor(numChannels: number, sampleRate: number, options: IWebAudioApiBackendOptions) {
            this._backend = new WebAudioApiBackend(numChannels, sampleRate, options);
            this.channels = numChannels;
            this.rate = sampleRate;
            this.targetRate = this._backend.Rate;
            this.bufferSize = this._backend.BufferSize;

            this._backend.OnStarved = (function () {
                if (this.OnStarved) {
                    this.OnStarved();
                }
            }).bind(this);

            this._backend.OnBufferLow = (function () {
                if (this.OnBufferLow) {
                    this.OnBufferLow();
                }
            }).bind(this);
        }

        private resample(sampleData: SampleBuffer) : SampleBuffer {
            var rate = this.rate,
                channels = this.channels,
                targetRate = this._backend.Rate,
                targetChannels = this._backend.Channels;

            if (rate == targetRate && channels == targetChannels) {
                return sampleData;
            } else {
                var newSamples: SampleBuffer = [];
                for (var channel = 0; channel < targetChannels; channel++) {
                    var inputChannel = channel;
                    if (channel >= channels) {
                        // Flash forces output to stereo; if input is mono, dupe the first channel
                        inputChannel = 0;
                    }
                    var input = sampleData[inputChannel],
                        output = new Float32Array(Math.round(input.length * targetRate / rate));
                    for (var i = 0; i < output.length; i++) {
                        output[i] = input[(i * rate / targetRate) | 0];
                    }
                    newSamples.push(output);
                }
                return newSamples;
            }
        }

        public Clear() {
            this._backend.Clear();
        }

        public BufferData(sampleData: SampleBuffer) {
            if (this._backend) {
                var samples = this.resample(sampleData);
                this._backend.AppendBuffer(samples);
            } else {
                throw 'Invalid state: AudioFeeder cannot bufferData before init';
            }
        }

        private getPlaybackState(): IPlaybackState {
            if (this._backend) {
                return this._backend.GetPlaybackState();
            } else {
                throw 'Invalid state: AudioFeeder cannot getPlaybackState before init';
            }
        }

        public Start() {
            if (this._backend) {
                this._backend.Start();
            } else {
                throw 'Invalid state: AudioFeeder cannot start before init';
            }
        }

        public Stop() {
            if (this._backend) {
                this._backend.Stop();
            } else {
                throw 'Invalid state: AudioFeeder cannot stop before init';
            }
        }

        public Flush() {
            if (this._backend) {
                this._backend.Flush();
            } else {
                throw 'Invalid state: AudioFeeder cannot flush before init';
            }
        }

        public Close() {
            if (this._backend) {
                this._backend.Close();
                this._backend = null;
            }
        }
    }
}