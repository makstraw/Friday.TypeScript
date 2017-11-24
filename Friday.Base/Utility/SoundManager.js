var Friday;
(function (Friday) {
    var Utility;
    (function (Utility) {
        var SoundTrackArray = (function () {
            function SoundTrackArray() {
                this.SoundArray = [];
                this.counter = 0;
            }
            SoundTrackArray.prototype.Set = function (positionMs) { throw new Error("Not implemented"); };
            SoundTrackArray.prototype.Play = function () {
                if (this.SoundArray.length == 0)
                    throw ("SoundTrackArray is empty");
                if (this.counter >= this.SoundArray.length)
                    this.counter = 0;
                this.SoundArray[this.counter].Play();
                this.counter++;
            };
            SoundTrackArray.prototype.Stop = function () {
                for (var i = 0; i < this.SoundArray.length; i++) {
                    this.SoundArray[i].Stop();
                }
            };
            SoundTrackArray.prototype.Pause = function () {
                for (var i = 0; i < this.SoundArray.length; i++) {
                    this.SoundArray[i].Stop();
                }
            };
            SoundTrackArray.FromSingleTrack = function (track, repeat) {
                var trackArray = new SoundTrackArray();
                trackArray.Name = track.Name;
                for (var i = 0; i < repeat; i++) {
                    trackArray.SoundArray.push(track.Clone());
                }
                return trackArray;
            };
            return SoundTrackArray;
        }());
        Utility.SoundTrackArray = SoundTrackArray;
        var SoundTrack = (function () {
            function SoundTrack(name, path, type, volume) {
                if (type === void 0) { type = "audio/mpeg"; }
                if (volume === void 0) { volume = 1; }
                this.Name = name;
                this.FilePath = path;
                this.FileType = type;
                this.Volume = volume;
                this.Handle = new Audio(this.FilePath);
                this.Handle.volume = volume;
            }
            SoundTrack.prototype.Set = function (positionMs) {
                this.Handle.currentTime = positionMs / 1000;
            };
            SoundTrack.prototype.Play = function () { this.Handle.play(); };
            SoundTrack.prototype.Stop = function () { this.Handle.pause(); this.Handle.currentTime = 0; };
            SoundTrack.prototype.Pause = function () { this.Handle.pause(); };
            SoundTrack.prototype.Clone = function () {
                return new SoundTrack(this.Name, this.FilePath, this.FileType, this.Volume);
            };
            return SoundTrack;
        }());
        Utility.SoundTrack = SoundTrack;
        var SoundManager = (function () {
            function SoundManager(switchHandle) {
                this.SoundLibrary = [];
                this.soundStateHandle = switchHandle;
            }
            SoundManager.prototype.Add = function (track) {
                this.SoundLibrary.push(track);
            };
            SoundManager.prototype.Play = function (name, positionMs) {
                if (this.soundStateHandle()) {
                    var track = this.findTrackByName(name);
                    if (typeof positionMs != "undefined") {
                        track.Set(positionMs);
                    }
                    track.Play();
                }
            };
            SoundManager.prototype.Stop = function (name) {
                var track = this.findTrackByName(name);
                track.Stop();
            };
            SoundManager.prototype.findTrackByName = function (name) {
                for (var i = 0; i < this.SoundLibrary.length; i++) {
                    if (this.SoundLibrary[i].Name == name)
                        return this.SoundLibrary[i];
                }
            };
            return SoundManager;
        }());
        Utility.SoundManager = SoundManager;
    })(Utility = Friday.Utility || (Friday.Utility = {}));
})(Friday || (Friday = {}));
//# sourceMappingURL=SoundManager.js.map