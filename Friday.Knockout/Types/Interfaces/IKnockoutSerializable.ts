///<reference path="../../../Friday.Base/ValueObjects/ISerializable.ts"/>
namespace Friday.Knockout.Types {
    import ISerializable = Friday.ValueTypes.ISerializable;

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