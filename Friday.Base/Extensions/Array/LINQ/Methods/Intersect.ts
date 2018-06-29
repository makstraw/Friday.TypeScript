///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Intersect<TResult>(second: Array<TResult>): Array<TResult>;
//    Intersect<TResult>(second: Array<TResult>, compareSelector: EqualityComparison<TResult>): Array<TResult>;
}

Array.prototype.Intersect = function (second: Array<any>, compareSelector?: EqualityComparison<any>): Array<any> {
    if (!Array.isArray(second)) throw new Friday.Exceptions.ArgumentException('second');
    let output: Array<any> = [];
    if (typeof compareSelector !== "function") {
        compareSelector = (a, b) => a === b;
    }


    for (let i = 0; i < this.length; i++) {
        if (second.Has(this[i])) output.push(this[i]);
    }
    return output;
}