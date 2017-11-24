///<reference path="../Definitions/seedrandom.d.ts"/>
Array.prototype.shuffle = function (seed) {
    if (typeof (seed) == "undefined" || seed.length == 0) {
        this.sort(function () { return 0.5 - Math.random(); });
    }
    else {
        var seedrandom = Math.seedrandom;
        var rngInstance = seedrandom(seed, { state: true });
        console.log(rngInstance);
        this.sort(function () { return 0.5 - rngInstance(); });
    }
};
Array.prototype.shuffle2 = function (seed) {
    var temporaryValue;
    var randomIndex;
    var seedrandom = Math.seedrandom;
    var currentIndex = this.length;
    if (typeof (seed) == "undefined" || seed.length == 0) {
        var rngInstance = seedrandom();
    }
    else {
        var rngInstance = seedrandom(seed, { state: true });
    }
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(rngInstance() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = this[currentIndex];
        this[currentIndex] = this[randomIndex];
        this[randomIndex] = temporaryValue;
    }
};
//# sourceMappingURL=ArrayExtensions.js.map