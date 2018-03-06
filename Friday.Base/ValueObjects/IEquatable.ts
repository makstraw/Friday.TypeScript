namespace Friday.ValueTypes {
    export interface IEquatable<T> {
        Equals(other: T): boolean;
    }

    export function IsEquatable(value: any): boolean {
        return typeof value === "object" && typeof value["Equals"] === "function";
    }

    export function Equals(object1: IEquatable<any>, object2: IEquatable<any>): boolean {
        return object1.Equals(object2);
    }
}