///<reference path="Has.ts"/>
interface Array<T> {
    Except(otherArr: Array<Friday.ValueTypes.IEqualityComparer<any>> | Array<string> | Array<number>): Array<T>;
}



Array.prototype.Except = function (otherArr: Array<Friday.ValueTypes.IEqualityComparer<any>> | Array<string> | Array<number>): Array<Friday.ValueTypes.IEqualityComparer<any>> {
    return this.filter(function (value: Friday.ValueTypes.IEqualityComparer<any> | string | number, index: number) {
        return !otherArr.Has(value);
    });
}