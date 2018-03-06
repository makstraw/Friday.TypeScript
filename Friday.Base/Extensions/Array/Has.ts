///<reference path="../../ValueObjects/IEquatable.ts"/>
interface Array<T> {
    Has(otherValue: Friday.ValueTypes.IEquatable<any> | string | number): boolean;
}

Array.prototype.Has = function (otherValue: Friday.ValueTypes.IEquatable<any> | string | number): boolean {
    let index = this.findIndex(function (value: Friday.ValueTypes.IEquatable<any> | string | number) {
        if (typeof otherValue == "object")
            return (value as Friday.ValueTypes.IEquatable<any>).Equals(otherValue);
        else return value === otherValue;
    });

    if (index === -1) return false;
    return true;
}