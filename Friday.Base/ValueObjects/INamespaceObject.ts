namespace Friday.ValueTypes {
    export interface INamespaceObject<T> {
        [key: string]: T;
    }

    export function ScanNamespace(namespace: INamespaceObject<any>): Array<string> {
        let output = Object.getOwnPropertyNames(namespace);
        return output;
    }
}