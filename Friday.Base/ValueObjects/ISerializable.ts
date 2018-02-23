namespace Friday.ValueTypes {
    export interface ISerializable<T> {
        ToDto(): T;
    }
}