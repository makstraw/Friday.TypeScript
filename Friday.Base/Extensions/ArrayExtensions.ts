///<reference path="../Definitions/seedrandom.d.ts"/>
///<reference path="StringExtensions.ts"/>
///<reference path="../Exceptions/Array/reference.ts"/>
interface Array<T> {
    shuffle(seed?: string): void;
    shuffle2(seed?: string): void;
    MoveUp(element: T): void;
    MoveDown(element: T): void;
    MoveTop(element: T): void;
    MoveBottom(element: T): void;
    MoveTo(element: T, toIndex: number);
    MoveTo(element: T, toIndex: number, relative: boolean);
    IsEmpty: boolean;
    Multiply(): number;
}

Object.defineProperty(Array.prototype,
    "IsEmpty",
    {
        get: function IsEmpty(): boolean {
            return this.length === 0;
        },
        set: () => undefined,
        enumerable: true
    });

Array.prototype.Multiply = function(): number {
    return this.reduce((a, b) => parseFloat(a) * parseFloat(b));
};

Array.prototype.shuffle = function (seed: string): void {
    if (typeof (seed) == "undefined" || seed.IsEmpty) {
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

    if (typeof (seed) == "undefined" || seed.IsEmpty) {
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

Array.prototype.MoveUp = function(element: any) {
    let index = this.indexOf(element);
    if (index === -1) throw new Friday.Exceptions.ArrayItemNotFoundException(element);
    if (index === 0) return;
    this.splice(index, 1);
    this.splice(index - 1, 0, element);
}

Array.prototype.MoveDown = function (element: any) {
    let index = this.indexOf(element);
    if (index === -1) throw new Friday.Exceptions.ArrayItemNotFoundException(element);
    if (index === this.length - 1) return;
    this.splice(index, 1);
    this.splice(index + 1, 0, element);
}

Array.prototype.MoveTop = function (element: any) {
    let index = this.indexOf(element);
    if (index === -1) throw new Friday.Exceptions.ArrayItemNotFoundException(element);
    if (index === 0) return;
    this.splice(index, 1);
    this.unshift(element);
}

Array.prototype.MoveBottom = function (element: any) {
    let index = this.indexOf(element);
    if (index === -1) throw new Friday.Exceptions.ArrayItemNotFoundException(element);
    if (index === this.length - 1) return;
    this.splice(index, 1);
    this.push(element);
}

Array.prototype.MoveTo = function (element: any, toIndex: number, relative: boolean = false) {
    let index = this.indexOf(element);
    if (index === -1) throw new Friday.Exceptions.ArrayItemNotFoundException(element);
    if (relative) toIndex = index + toIndex;
    if (toIndex < 0 || toIndex > this.length - 1)
        throw new Friday.Exceptions.ArrayIndexOutOfRangeException(this, toIndex);

    this.splice(index, 1);
    this.splice(toIndex, 0, element);
}