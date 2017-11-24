///<reference path="Stream.ts"/>
namespace Friday.Audio.Amr {
    import WritableStream = Streams.WritableStream
    export class AmrStream extends WritableStream<Uint8Array> {
        private readonly SINGLE_CHANNEL_MAGIC: string = "#!AMR\n";
        private readonly MULTI_CHANNEL_MAGIC: string = "#!AMR_MC1.0\n";
        private readonly WB_SINGLE_CHANNEL_MAGIC: string = "#!AMR-WB\n";
        private readonly WB_MULTI_CHANNEL_MAGIC: string = "#!AMR-WB_MC1.0\n";

        
    }

    class AmrNbHeader {
        
    }

    class AmrNbMcHeader {
        
    }

    class AmrWbHeader {
        
    }

    class AmrWbMcHeader {
        
    }

    class SpeechFrame {
        
    }
}