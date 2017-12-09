namespace Friday.Audio.Amr {
    export class AMR {
        public static MAGIC_NUMBER: [35, 33, 65, 77, 82, 10];
        public static MAGIC_NUMBER_STRING: "#!AMR\n";

        /** Decoding modes and its frame sizes (bytes), respectively */
        public static modes: Array<number> = [12, 13, 15, 17, 19, 20, 26, 31, 5];

        private frame_size = 320;
        private ring_size = 2304;
        private linoffset = 0;
        private ringoffset = 0;
        private modoffset = 0;
        private linbuf = new Int16Array(this.frame_size);
        private ring = new Int16Array(this.ring_size * 2);
        private modframes = new Int16Array(this.frame_size);
        private framesbuf: Uint8Array;
        private decoder: AMRDecoder;
        private encoder: AMREncoder;

        constructor() {
            this.decoder = new AMRDecoder();
            this.encoder = new AMREncoder();
            this.init();
        }

        private init() {
            this.encoder.Init();
            this.decoder.Init();
        }

        public Encode(data: Float32Array | Int16Array, isFile: boolean) {
            isFile = !!isFile;

            if (isFile) {
                return this.encoder.Process(data);
            }

            // ring spin
            for (var i = -1, j = this.ringoffset; ++i < data.length; ++j) {
                this.ring[j] = data[i];
            }

            this.ringoffset += data.length;

            // has enough to decode
            if ((this.ringoffset > this.linoffset)
                && (this.ringoffset - this.linoffset < this.frame_size)) {

                return;
            }

            // buffer fill
            for (var i = -1; ++i < this.linbuf.length;) {
                this.linbuf[i] = this.ring[this.linoffset + i];
            }

            this.linoffset += this.linbuf.length;
            this.framesbuf = this.encoder.Process(this.linbuf);

            if (this.ringoffset > this.ring_size) {
                this.modoffset = this.ringoffset % this.ring_size;

                //console.log("ignoring %d samples", this.modoffset);
                this.ringoffset = 0;
            }

            if (this.linoffset > this.ring_size) {
                this.linoffset = 0;
            }

            return this.framesbuf;
        }

        public Decode(bitstream: Uint8Array) : Float32Array {
            return this.decoder.Process(bitstream);
        }

        public Close() {
            this.decoder.Close();
            this.encoder.Close();
        }
    }
}