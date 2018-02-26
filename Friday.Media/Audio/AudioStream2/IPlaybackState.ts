namespace Friday.AudioLib {
    export interface IPlaybackState {
        PlaybackPosition: number;
        SamplesQueued: number;
        Dropped: number;
        Delayed: number;
    }
}