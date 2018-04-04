///<reference path="Where.ts"/>
interface Array<T> {
    Count(predictate?: Predictate<T> | PredictateWithIndex<T>): number;
}

Array.prototype.Count = function(predictate?: Predictate<any> | PredictateWithIndex<any>):number {
    if (typeof predictate === "undefined") return this.length;
    else this.Where(predictate).Count();
}