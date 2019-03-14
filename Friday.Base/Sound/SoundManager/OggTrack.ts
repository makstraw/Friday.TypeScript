///<reference path="SoundTrack.ts"/>
namespace Friday.Sound {
    export class OggTrack extends SoundTrack {
        constructor(name: string, path: string, volume = 1) {
            super(name, path, "audio/ogg", volume);
        }
    }
}