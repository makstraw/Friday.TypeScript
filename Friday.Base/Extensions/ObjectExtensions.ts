///<reference path="../Utility/ObjectComparison.ts"/>
interface Object {
    Equals(compareTo: object): boolean;
}

Object.prototype.Equals = function (compareTo: any): boolean {
    return compareObjects(this, compareTo);
}
