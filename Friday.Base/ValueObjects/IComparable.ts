namespace Friday.ValueTypes {
    export interface IComparable<T> {
        CompareTo(other: T): number;
        Equals(other: T): boolean;
        GreaterThan(other: T): boolean;
        GreaterThanOrEqual(other: T): boolean;
        LessThan(other: T): boolean;
        LessThanOrEqual(other: T): boolean;
    }
}