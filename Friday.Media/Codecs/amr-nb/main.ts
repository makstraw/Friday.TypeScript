///<reference path="AudioStream.ts"/>
namespace Main {
    import AudioStream = Friday.Audio.AudioStream;
    export var audioCtx = new AudioContext();
    export var audioStream = new AudioStream(audioCtx);
    audioStream.Connect(audioCtx.destination);

}


namespace Friday.Audio.Amr {
    class AmrNb {
        
    }

    class Codec {
        
    }

    class Encoder {
        
    }

    class Decoder {
        private readonly blockSize: number = 20;
        private readonly frameSize: number = 160;

        constructor() {
            
        }

        private init() : void {
            
        }

        private validate() : boolean {
            return true;
        }

        public read() {
            
        }

        public write() {
            
        }

        public process() {
            
        }

        public close() {
            
        }
        
    }

}