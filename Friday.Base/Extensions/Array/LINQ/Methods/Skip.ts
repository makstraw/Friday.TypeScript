///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Skip<TResult>(count: number): Array<TResult>;
}

Array.prototype.Skip = function (count: number): Array<any> {
    if (typeof count !== "number" || count < 0 || isNaN(count)) throw new Friday.Exceptions.ArgumentException("count");
    let output: Array<any> = [];
    if (this.length > count) {
        output = this.slice(count);
    } else output = this;
    return output;
}