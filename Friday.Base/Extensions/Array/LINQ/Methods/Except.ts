///<reference path="Has.ts"/>
interface Array<T> {
    Except(otherArr: Array<Friday.System.IEquatable<any>> | Array<string> | Array<number>): Array<T>;
}



Array.prototype.Except = function (otherArr: Array<Friday.System.IEquatable<any>> | Array<string> | Array<number>): Array<Friday.System.IEquatable<any>> {
    return this.filter(function (value: Friday.System.IEquatable<any> | string | number, index: number) {
        return !otherArr.Has(value);
    });
}