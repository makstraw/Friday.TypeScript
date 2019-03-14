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
        NonObservablesOnly,
        PrimitivesOnly,
        FieldsFilterOnly
    }

    export interface IKnockoutSerializable<T> extends ISerializable<T> {
        readonly SerializationMode: SerializationMode;
        readonly SerializationFilter: SerializationFilter;
        readonly SerializationFields: Array<string>;

    }
}