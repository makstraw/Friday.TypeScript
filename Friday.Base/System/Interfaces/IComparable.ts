///<reference path="IEqualityComparer.ts"/>
namespace Friday.System {

    export interface IComparable<T> extends IEqualityComparer<T>{
        CompareTo(other: T): number;
        GreaterThan(other: T): boolean;
        GreaterThanOrEqual(other: T): boolean;
        LessThan(other: T): boolean;
        LessThanOrEqual(other: T): boolean;
    }
}