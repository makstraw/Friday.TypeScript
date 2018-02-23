///<reference path="../../ValueObjects/IEqualityComparer.ts"/>
interface Array<T> {
    Has(otherValue: Friday.ValueTypes.IEqualityComparer<any> | string | number): boolean;
}

Array.prototype.Has = function (otherValue: Friday.ValueTypes.IEqualityComparer<any> | string | number): boolean {
    let index = this.findIndex(function (value: Friday.ValueTypes.IEqualityComparer<any> | string | number) {
        if (typeof otherValue == "object")
            return (value as Friday.ValueTypes.IEqualityComparer<any>).Equals(otherValue);
        else return value === otherValue;
    });

    if (index === -1) return false;
    return true;
}