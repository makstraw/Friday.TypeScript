///<reference path="../Extensions/ObservableExtension/Serialize.ts"/>
///<reference path="../Types/Interfaces/IKnockoutSerializable.ts"/>
namespace Friday.Knockout.Models {
    import SerializationFilter = Knockout.Types.SerializationFilter;
    import SerializationMode = Knockout.Types.SerializationMode;
    import IKnockoutSerializable = Knockout.Types.IKnockoutSerializable;

    export abstract class SerializableModel<T> implements IKnockoutSerializable<T> {
        [index: string]: any;
        public readonly SerializationMode: SerializationMode = Knockout.Types.SerializationMode.Exclude;
        public readonly SerializationFilter: SerializationFilter = Knockout.Types.SerializationFilter.ObservablesOnly;

        public ToDto(): T {
            let dto = ko.ToDto(this);
            return dto as any;
        }
    }
}