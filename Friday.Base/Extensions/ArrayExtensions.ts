///<reference path="../Definitions/seedrandom.d.ts"/>
///<reference path="StringExtensions.ts"/>
interface Array<T> {
    shuffle(seed?: string): void;
    shuffle2(seed?: string): void;
}

Array.prototype.shuffle = function (seed: string): void {
    if (typeof (seed) == "undefined" || seed.IsEmpty()) {
        this.sort(() => 0.5 - Math.random());
    } else {
        let rngInstance = new Math.seedrandom(seed, { state: true });
        this.sort(() => 0.5 - rngInstance());
    }
}

Array.prototype.shuffle2 = function (seed: string): void {
    let temporaryValue: any;
    let randomIndex: number;
    let currentIndex: number = this.length;
    let rngInstance: prng;

    if (typeof (seed) == "undefined" || seed.IsEmpty()) {
        rngInstance = new Math.seedrandom();
    } else {
        rngInstance = new Math.seedrandom(seed, { state: true });
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
}