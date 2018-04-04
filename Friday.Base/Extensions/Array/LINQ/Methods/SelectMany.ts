///<reference path="../../../../Exceptions/Basic/ArgumentException.ts"/>

interface Array<T> {
    SelectMany<TResult>(collectionSelector: SelectorWithIndex<T, Array<TResult>> | null | undefined): Array<TResult>;
    SelectMany<TElement, TResult>(collectionSelector: SelectorWithIndex<T, Array<TElement>> | null | undefined, resultSelector: (collection: T, element: TElement) => TResult): Array<TResult>;
}

Array.prototype.SelectMany = function<TResult>(collectionSelector:
    SelectorWithIndex<any, Array<any>> | null | undefined,
    resultSelector?: (collection: any, element: any) => TResult): Array<TResult> {

    if (typeof collectionSelector !== "function") throw new Friday.Exceptions.ArgumentException('collectionSelector');
    if (typeof resultSelector === "undefined") resultSelector = (a: any, b: any) => <TResult>b;
    let output: Array<TResult> = [];
    this.forEach((value, index) => {
        collectionSelector(value, index).forEach(subValue => {
            output.push(resultSelector(value, subValue));
        });
    },this);
    return output;
}