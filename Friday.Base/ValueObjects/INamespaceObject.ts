namespace Friday.ValueTypes {
    export interface INamespaceObject<T> {
        [key: string]: T;
    }
}