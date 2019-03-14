///<reference path="ISoundTrack.ts"/>
///<reference path="../../Exceptions/Basic/NotInitializedException.ts"/>
///<reference path="TrackNotFoundException.ts"/>
namespace Friday.Sound {
    import TrackNotFoundException = Exceptions.TrackNotFoundException;
    import NotInitializedException = Exceptions.NotInitializedException;

    export class SoundManager {

        private readonly soundStateHandle: Function;

        constructor(switchHandle: Function) {
            this.soundStateHandle = switchHandle;
        }

        public SoundLibrary: Array<ISoundTrack> = [];

        public Add(track: ISoundTrack) {
            this.SoundLibrary.push(track);
        }

        public FillLibrary(tracks: Array<ISoundTrack>) {
            this.SoundLibrary = [...tracks];
        }

        public Play(name: string, positionMs?: number) {
            if (this.soundStateHandle()) {
                var track: ISoundTrack = this.findTrackByName(name);
                if (typeof positionMs !== "undefined") {
                    track.Set(positionMs);
                }
                track.Play();
            } else throw new NotInitializedException(this.constructor.name);
        }


        public Stop(name: string) {
            var track: ISoundTrack = this.findTrackByName(name);
            track.Stop();
        }

        private findTrackByName(name: string): ISoundTrack {
            for (var i = 0; i < this.SoundLibrary.length; i++) {
                if (this.SoundLibrary[i].Name === name) return this.SoundLibrary[i];
            }
            throw new TrackNotFoundException(name);
        }
    }
}