///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Sum<TResult>(selector?: Selector<T, TResult>): number;
}

Array.prototype.Sum = function (selector?: Selector<any, any>): number {
    if (typeof selector !== "function") return this.reduce((a, b) => a + b, 0);
    return this.Select(selector).reduce((a, b) => a + b, 0);
}