/// <reference path="../../../Friday.Base/System/Interfaces/ISerializable.ts" />
// ReSharper disable once InconsistentNaming

interface IKnockoutExtendersSerializeOptions {
    Mode: Friday.Knockout.Types.SerializationMode;
    FieldName?: string;
}

interface KnockoutExtenders {
    Serialize: (target: any, options: IKnockoutExtendersSerializeOptions) => void;
}

ko.extenders.Serialize = function (target: any, options: IKnockoutExtendersSerializeOptions) {
    target.SerializationMode = options.Mode;
    if (typeof options.FieldName != "undefined") target.FieldName = options.FieldName;
};

// ReSharper disable once InconsistentNaming
interface KnockoutObservable<T> {
    SerializationMode: Friday.Knockout.Types.SerializationMode;
    FieldName?: string;
}

interface KnockoutStatic {
    ToDto(model: Friday.Knockout.Models.SerializableModel<any>): object;
    ToDto(viewModel: Friday.Knockout.ViewModels.SerializableViewModel): object;
}

function typeIsPrimitive(value: any): boolean {
    return typeof value === "number" || typeof value === "boolean" || typeof value === "string";
}

function typeIsFunction(value: any): boolean {
    return typeof value === "function";
}

function isSerializable(value: any): boolean {
    return typeof value === "object" && typeof value["ToDto"] === "function";
}

function isPassingFilters(serializationMode: Friday.Knockout.Types.SerializationMode, serializationFilter: Friday.Knockout.Types.SerializationFilter, value: KnockoutObservable<any>): boolean {
    //Observables not allowed by filter
    if (serializationFilter !== Friday.Knockout.Types.SerializationFilter.All && serializationFilter !== Friday.Knockout.Types.SerializationFilter.ObservablesOnly) return false;

    //Serialization mode set to Include Selected
    if (serializationMode === Friday.Knockout.Types.SerializationMode.Include &&
        value.SerializationMode === Friday.Knockout.Types.SerializationMode.Include) return true;
    //Serialization mode set to Exclude Selected
    if (serializationMode === Friday.Knockout.Types.SerializationMode.Exclude &&
        value.SerializationMode !== Friday.Knockout.Types.SerializationMode.Exclude) return true;
    //Filter not passed
    return false;

}

ko.ToDto = function(viewModel: Friday.Knockout.ViewModels.SerializableViewModel |
                               Friday.Knockout.Models.SerializableModel<any>): object {
    let dto: object = {};
    let keys = Object.keys(viewModel);
    for (let i = 0; i < keys.length; i++) {
        let propName = keys[i];
        let propValue: any;
        let property = viewModel[propName];

        if (propName === "SerializationFilter" || propName === "SerializationMode") continue;

        if (ko.isObservable(property)) {
            if (isPassingFilters(viewModel.SerializationMode, viewModel.SerializationFilter, property)) {
                propValue = ko.unwrap(property);

                if (isSerializable(propValue))
                    propValue = (propValue as Friday.System.ISerializable<any>).ToDto();
                if (typeof (property as KnockoutObservable<any>).FieldName !== "undefined")
                    propName = property.FieldName;
            }
        } else if (viewModel.SerializationFilter !== Friday.Knockout.Types.SerializationFilter.ObservablesOnly) {
            if (typeIsFunction(property)) continue;

            if (isSerializable(property))
                propValue = (property as Friday.System.ISerializable<any>).ToDto();
            else propValue = viewModel[propName];


        }
        if(typeof propValue !== "undefined")
            (dto as any)[propName] = propValue;        
    }
    return dto;
}