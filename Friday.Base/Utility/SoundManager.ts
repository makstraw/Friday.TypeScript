namespace Friday.Utility {

    type TSound = "audio/ogg" | "audio/mpeg" | "audio/wav";

    export interface ISoundTrack {
        Name: string;
        Play(): void;
        Stop(): void;
        Pause(): void;
        Set(positionMs: number): void;
    }

    export class SoundTrackArray implements ISoundTrack {
        Set(positionMs: number): void { throw new Error("Not implemented"); }

        public Play(): void {
            if (this.SoundArray.length == 0) throw ("SoundTrackArray is empty");
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
    }

    export class SoundTrack implements ISoundTrack {

        Set(positionMs: number): void {
            this.Handle.currentTime = positionMs / 1000;
        }

        Play(): void { this.Handle.play(); }

        Stop(): void { this.Handle.pause(); this.Handle.currentTime = 0 }

        Pause(): void { this.Handle.pause(); }

        public Name: string;
        private FilePath: string;
        private FileType: TSound;
        private Volume: number;
        private Handle: HTMLAudioElement;

        public Clone(): SoundTrack {
            return new SoundTrack(this.Name, this.FilePath, this.FileType, this.Volume);
        }

        constructor(name: string, path: string, type: TSound = "audio/mpeg", volume = 1) {
            this.Name = name;
            this.FilePath = path;
            this.FileType = type;
            this.Volume = volume;
            this.Handle = new Audio(this.FilePath);
            this.Handle.volume = volume;
        }
    }

    export class SoundManager {

        private soundStateHandle: Function;

        constructor(switchHandle : Function) {
            this.soundStateHandle = switchHandle;
        }

        public SoundLibrary: Array<ISoundTrack> = [];

        public Add(track: ISoundTrack) {
            this.SoundLibrary.push(track);
        }

        public Play(name: string, positionMs?: number) {
            if (this.soundStateHandle()) {
                var track: ISoundTrack = this.findTrackByName(name);
                if (typeof positionMs != "undefined") {
                    track.Set(positionMs);
                }
                track.Play();
            }
        }


        public Stop(name: string) {
            var track: ISoundTrack = this.findTrackByName(name);
            track.Stop();
        }

        private findTrackByName(name: string): ISoundTrack {
            for (var i = 0; i < this.SoundLibrary.length; i++) {
                if (this.SoundLibrary[i].Name == name) return this.SoundLibrary[i];
            }
        }
    }
}