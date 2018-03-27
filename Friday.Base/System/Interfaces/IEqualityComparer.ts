///<reference path="IEquatable.ts"/>
namespace Friday.System {
    export interface IEqualityComparer<T> extends IEquatable<T> {
        GetHashCode(): number;
    }

}