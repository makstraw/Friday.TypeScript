namespace Friday.Sound {
    export interface ISoundTrack {
        Name: string;
        Play(): void;
        Stop(): void;
        Pause(): void;
        Set(positionMs: number): void;
    }
}