///<reference path="ISoundTrack.ts"/>
namespace Friday.Sound {
    type TSound = "audio/ogg" | "audio/mpeg" | "audio/wav";

    export class SoundTrack implements ISoundTrack {

        public Set(positionMs: number): void {
            this.Handle.currentTime = positionMs / 1000;
        }

        public Play(): void { this.Handle.play(); }

        public Stop(): void { this.Handle.pause(); this.Handle.currentTime = 0 }

        public Pause(): void { this.Handle.pause(); }

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
}