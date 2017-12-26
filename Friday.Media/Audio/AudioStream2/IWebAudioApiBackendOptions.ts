namespace Friday.AudioLib {
    export interface IWebAudioApiBackendOptions {
        Context?: AudioContext;
        Destination?: AudioNode;
        BufferSize?: AudioStreamBufferSize;
    }
}