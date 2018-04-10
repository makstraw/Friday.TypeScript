///<reference path="../../../../System/Interfaces/IComparable.ts"/>
interface Array<T> {
    OrderBy<TKey extends Friday.System.IComparable<TKey> | number | string>(keySelector: Selector<T, TKey>): Array<T>;
    OrderUsing(comparison: Comparison<T>): Array<T>;
    OrderUsingReversed(comparison: Comparison<T>): Array<T>;
    OrderByDescending<TKey extends Friday.System.IComparable<TKey> | number | string>(keySelector: Selector<T, TKey>): Array<T>;
}


Array.prototype.OrderBy = function <TKey extends Friday.System.IComparable<any> | number | string>(keySelector: Selector<any, Friday.System.IComparable<TKey>>): Array<any> {
    return this.sort((a: Friday.System.IComparable<any>, b: Friday.System.IComparable<any>) => {
        let aKey = keySelector(a);
        let bKey = keySelector(b);
        if (Friday.System.IsComparable(aKey)) return Friday.System.CompareTo(aKey as Friday.System.IComparable<TKey>, bKey as Friday.System.IComparable<TKey>);
        if (typeof aKey === "number") {
            if (aKey > bKey) return 1;
            if (aKey < bKey) return -1;
            if (aKey === bKey) return 0;
        }
        if (typeof aKey === "string") {
            return aKey.localeCompare(bKey as string);
        }
        return 0;
    });
}

Array.prototype.OrderByDescending = function <TKey extends Friday.System.IComparable<TKey> | number | string>(keySelector: Selector<any, TKey>): Array<any> {
    return this.OrderBy(keySelector).reverse();
}


Array.prototype.OrderUsing = function(comparison: Comparison<any>): Array<any> {
    return this.sort((a: any, b: any) => comparison(a, b));
}

Array.prototype.OrderUsingReversed = function (comparison: Comparison<any>): Array<any> {
    return this.sort((a: any, b: any) => comparison(a, b)).reverse();
}