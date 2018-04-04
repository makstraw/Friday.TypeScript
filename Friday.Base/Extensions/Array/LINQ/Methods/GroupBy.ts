interface Array<T> {
    GroupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>): Array<Friday.Collections.KeyValuePair<TKey, Array<T>>>;
    GroupBy<TKey>(keySelector: SelectorWithIndex<T, TKey>, elementSelector: SelectorWithIndex<T, T>, compareSelector?: HashSelector<TKey>): Array<Friday.Collections.KeyValuePair<TKey, Array<T>>>;
    GroupBy<TKey, TElement>(keySelector: SelectorWithIndex<T, TKey>, elementSelector: SelectorWithIndex<T, TElement>, compareSelector?: HashSelector<TKey>): Array<Friday.Collections.KeyValuePair<TKey, Array<T>>>;
    GroupBy<TKey, TElement>(keySelector: SelectorWithIndex<T, TKey> | Selector<T, TKey>, elementSelector?: SelectorWithIndex<T, TElement> | Selector<T, TElement>, compareSelector?: HashSelector<TKey>): Array<Friday.Collections.KeyValuePair<TKey, Array<T>>>;
}

Array.prototype.GroupBy = function (keySelector: SelectorWithIndex<any, any> | Selector<any, any>,
    elementSelector?: SelectorWithIndex<any, any> | Selector<any, any>,
    compareSelector?: HashSelector<any>): Array<Friday.Collections.KeyValuePair<any, any>> {
    if (!elementSelector) elementSelector = (source, index) => source;
    let output: Array<Friday.Collections.KeyValuePair<any, Array<any>>> = [];

    this.forEach((x: any, i: any) => {
        let key = (keySelector as SelectorWithIndex<any, any>)(x, i);
        let element = (elementSelector as SelectorWithIndex<any, any>)(x, i);
        let array = output.First(item => item.Key === key);
        if (array !== null && array instanceof Friday.Collections.KeyValuePair && Array.isArray(array.Value)) array.Value.push(element);
        else output.push(new Friday.Collections.KeyValuePair<any,Array<any>>(key, [element]));
    });

    return output;
}