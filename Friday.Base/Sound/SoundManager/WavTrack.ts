///<reference path="SoundTrack.ts"/>
namespace Friday.Sound {
    export class WavTrack extends SoundTrack {
        constructor(name: string, path: string, volume = 1) {
            super(name, path, "audio/wav", volume);
        }
    }
}