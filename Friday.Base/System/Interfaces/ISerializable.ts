namespace Friday.System {
    export interface ISerializable<T> {
        ToDto(): T;
    }
}