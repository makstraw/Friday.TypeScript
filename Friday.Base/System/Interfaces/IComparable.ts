///<reference path="IEqualityComparer.ts"/>
namespace Friday.System {

    export interface IComparable<T> extends IEqualityComparer<T>{
        CompareTo(other: T): number;
        GreaterThan(other: T): boolean;
        GreaterThanOrEqual(other: T): boolean;
        LessThan(other: T): boolean;
        LessThanOrEqual(other: T): boolean;
    }


    export function IsComparable(value: any): boolean {
        return typeof value === "object" && typeof value["CompareTo"] === "function";
    }

    export function CompareTo(object1: IComparable<any>, object2: IComparable<any>): number {
        return object1.CompareTo(object2);
    }
}