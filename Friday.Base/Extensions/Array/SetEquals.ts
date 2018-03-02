///<reference path="Has.ts"/>
interface Array<T> {
    SetEquals(otherArray: Array<T>): boolean;
}

Array.prototype.SetEquals = function (this: Array<any>, otherArray: Array<any>): boolean {
    if (this === otherArray) return true;
    if (otherArray == null) return false;
    if (this.length !== otherArray.length) return false;

    for (var i = 0; i < otherArray.length; i++) {
        if (!this.Has(otherArray[i])) return false;
    }
    return true;
}