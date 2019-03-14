///<reference path="SoundTrack.ts"/>
namespace Friday.Sound {
    export class Mp3Track extends SoundTrack {
        constructor(name: string, path: string, volume = 1) {
            super(name, path, "audio/mpeg", volume);
        }
    }
}