///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    Select<TResult>(selector: Selector<T, TResult>): Array<TResult>;
    Select<TResult>(selector: SelectorWithIndex<T, TResult>): Array<TResult>;
}

Array.prototype.Select = function (selector: Selector<any, any> | SelectorWithIndex<any,any>): Array<any> {
    if (typeof selector !== "function") throw new Friday.Exceptions.ArgumentException('selector');
    let output: Array<any> = [];
    let argCount = selector.length;

    for (let i = 0; i < this.length; i++) {
        if (argCount === 1) {
            output.push((selector as (arg: any) => any)(this[i]));
        } else if (argCount === 2) {
            output.push((selector as (arg: any, index: number) => any)(this[i],i));
        }
    }
    return output;
}