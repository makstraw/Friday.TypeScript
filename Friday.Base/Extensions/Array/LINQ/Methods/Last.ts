///<reference path="Where.ts"/>
interface Array<T> {
    Last(predictate?: Predictate<T> | PredictateWithIndex<T>): T;
}

Array.prototype.Last = function (predictate?: Predictate<any> | PredictateWithIndex<any>): any {
    if (this.length === 0) return null;
    if (typeof predictate === "undefined") return this[this.length-1];
    else return this.Where(predictate).Last();
}