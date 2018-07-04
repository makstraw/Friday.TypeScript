///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Take<TResult>(count: number): Array<TResult>;
}

Array.prototype.Take = function (count: number): Array<any> {
    if (typeof count !== "number" || count < 0 || isNaN(count)) throw new Friday.Exceptions.ArgumentException("count");
    let output: Array<any> = [];
    if (this.length > count) {
        output = this.slice(0, count - 1);
    } else {
        output = this;
    }
    return output;
}