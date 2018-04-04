///<reference path="IEquatable.ts"/>
namespace Friday.System {
    export interface IEqualityComparer<T> extends IEquatable<T> {
        GetHashCode(): number;
    }

    export function IsEqualityComparer(value: any): boolean {
        return typeof value === "object" && typeof value["GetHashCode"] === "function";
    }
}