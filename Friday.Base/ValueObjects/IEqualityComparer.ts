namespace Friday.ValueTypes {
    export interface IEqualityComparer<T> {
        Equals(other: T): boolean;
    }
}