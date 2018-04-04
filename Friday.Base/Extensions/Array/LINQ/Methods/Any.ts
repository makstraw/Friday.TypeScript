interface Array<T> {
    Any(predictate?: Predictate<T>): boolean;
}

Array.prototype.Any = function(predictate?: Predictate<any>): boolean {
    if (typeof predictate === "undefined") return this.length > 0;
    else return this.Where(predictate).Any();
}