///<reference path="../../../Friday.Base/System/Interfaces/ISerializable.ts"/>
namespace Friday.Knockout.Types {
    import ISerializable = Friday.System.ISerializable;

    export enum SerializationMode {
        Include,
        Exclude
    }

    export enum SerializationFilter {
        All,
        ObservablesOnly,
        PrimitivesOnly
    }

    export interface IKnockoutSerializable<T> extends ISerializable<T> {
        readonly SerializationMode: SerializationMode;
        readonly SerializationFilter: SerializationFilter;
    }
}