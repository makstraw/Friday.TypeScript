///<reference path="Where.ts"/>
interface Array<T> {
    First(predictate?: Predictate<T> | PredictateWithIndex<T>): T;
}

Array.prototype.First = function (predictate?: Predictate<any> | PredictateWithIndex<any>): any {
    if (this.length === 0) return null;
    if (typeof predictate === "undefined") return this[0];
    else return this.Where(predictate).First();
}