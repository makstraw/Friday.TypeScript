namespace Friday.AudioLib.Amr {
    export class AMRDecoder {
        private block_size = 20;
        private frame_size = 160;
        private state: any;

        private inputBuffer: number;//Uint8Array = new Uint8Array(8);
        private outputBuffer: number;
        private output: Float32Array = new Float32Array(160);

        public Init() {
            /* Create decoder */
            this.state = opencoreamr.Decoder_Interface_init();

            // Input Buffer
            this.inputBuffer = opencoreamr.allocate(20, 'i8', opencoreamr.ALLOC_STATIC);

            // Buffer to store the audio samples
            this.outputBuffer = opencoreamr.allocate(160, 'i16', opencoreamr.ALLOC_STATIC);
        }

        public Process(data: Uint8Array): Float32Array {
            var output_offset = 0, offset = 0, len: number;

            // Varies from quality
            let total_packets = Math.ceil(data.length / this.block_size);
            let estimated_size = this.frame_size * total_packets;
            let tot = 0;

            let input_addr = this.inputBuffer;
            let buffer_addr = this.outputBuffer;
            let state_addr = this.state;


            if (!this.output || this.output.length < estimated_size) {
                this.output = new Float32Array(estimated_size); 
            }

            while (offset < data.length) {
                /* Read bits */
                len = this.read(offset, data);

                /* Decode the data */
                opencoreamr.Decoder_Interface_Decode(state_addr, input_addr, buffer_addr, 0);


                /* Write the samples to the output buffer */
                this.write(output_offset, this.frame_size, buffer_addr);

                offset += len + 1;
                output_offset += this.frame_size;
                ++tot;
            }

            return this.output.subarray(0, output_offset);
        }

        private read(offset: any, data: any) {
            // block_size = 31 ==> [mode(1):frames(30)]
            var is_str = data.constructor == String.prototype.constructor;
            var dec_mode = is_str ? data.charCodeAt[0] : data[0];

            var nb = AMR.modes[(dec_mode >> 3) & 0x000F];
            var input_addr = this.inputBuffer;
            var len = offset + nb > data.length ? data.length - offset : nb;
            var bits: any;

            for (var m = offset - 1, k = 0; ++m < offset + len; k += 1) {
                bits = !is_str ? data[m] : data.charCodeAt[m];
                opencoreamr.setValue(input_addr + k, bits, 'i8');
            }

            return len;
        }

        private write(offset: any, nframes: any, addr: any) {
            let bits: any;
            for (var m = 0, k = offset - 1; ++k < offset + nframes; m += 2) {
                bits = opencoreamr.getValue(addr + m, "i16");
                this.output[k] = bits / 32768;
            }
        }

        public Close() {
            opencoreamr.Decoder_Interface_exit(this.state);
        }

    }
}