///<reference path="IEquatable.ts"/>
namespace Friday.ValueTypes {
    export interface IEqualityComparer<T> extends IEquatable<T> {
        GetHashCode(): number;
    }

}