///<reference path="SoundTrack.ts"/>
///<reference path="../../../Friday.Base/Exceptions/Basic/NotImplementedException.ts"/>
namespace Friday.Sound {
    import NotImplementedException = Exceptions.NotImplementedException;

    export class SoundTrackArray implements ISoundTrack {
        public Set(positionMs: number): void { throw new NotImplementedException("Set"); }

        public Play(): void {
            if (this.SoundArray.length === 0) throw ("SoundTrackArray is empty");
            if (this.counter >= this.SoundArray.length) this.counter = 0;
            this.SoundArray[this.counter].Play();
            this.counter++;
        }

        public Stop(): void {
            for (var i = 0; i < this.SoundArray.length; i++) {
                this.SoundArray[i].Stop();
            }
        }

        public Pause(): void {
            for (var i = 0; i < this.SoundArray.length; i++) {
                this.SoundArray[i].Stop();
            }
        }

        public Name: string;
        public SoundArray: Array<SoundTrack> = [];
        private counter: number = 0;

        public static FromSingleTrack(track: SoundTrack, repeat: number): SoundTrackArray {
            var trackArray = new SoundTrackArray();
            trackArray.Name = track.Name;
            for (var i = 0; i < repeat; i++) {
                trackArray.SoundArray.push(track.Clone());
            }
            return trackArray;
        }

        public static FromMultipleTracks(name: string, ...args: Array<SoundTrack>) {
            if (args.length === 0) throw ("SoundTrackArray is empty");
            var trackArray = new SoundTrackArray();
            trackArray.Name = name;
            for (var i = 0; i < args.length; i++) {
                trackArray.SoundArray.push(args[i].Clone());
            }
            return trackArray;
        }
    }
}