///<reference path="../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Where(predictate: (arg: T) => boolean): Array<T>;
    Where(predictate: (arg: T, index: number) => boolean): Array<T>;
}

Array.prototype.Where = function (predictate: ((arg: any) => boolean) | ((arg: any, index: number) => boolean)): Array<any> {
    if (typeof predictate !== "function") throw new Friday.Exceptions.ArgumentException('predictate');
    let output: Array<any> = [];

    let argCount = predictate.length;

    for (let i = 0; i < this.length; i++) {
        if (argCount === 1) {
            if ((predictate as ((arg: any) => boolean))(this[i])) output.push(this[i]);
        } else if (argCount === 2) {
            if ((predictate as ((arg: any, index: number) => boolean))(this[i],i)) output.push(this[i]);
        }
    }
    return output;
}