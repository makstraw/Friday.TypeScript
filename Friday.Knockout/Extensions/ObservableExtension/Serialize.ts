/// <reference path="../../../Friday.Base/ValueObjects/ISerializable.ts" />
// ReSharper disable once InconsistentNaming

interface IKnockoutExtendersSerializeOptions {
    Mode: Friday.Knockout.ViewModels.SerializationMode;
}

interface KnockoutExtenders {
    Serialize: (target: any, options: IKnockoutExtendersSerializeOptions) => void;
}

ko.extenders.Serialize = function (target: any, options: IKnockoutExtendersSerializeOptions) {
    target.SerializationMode = options.Mode;
};

// ReSharper disable once InconsistentNaming
interface KnockoutObservable<T> {
    Mode: Friday.Knockout.ViewModels.SerializationMode;
}

interface KnockoutStatic {
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

function isPassingFilters(serializationMode: Friday.Knockout.ViewModels.SerializationMode, serializationFilter: Friday.Knockout.ViewModels.SerializationFilter, value: KnockoutObservable<any>): boolean {
    //Observables not allowed by filter
    if (serializationFilter !== Friday.Knockout.ViewModels.SerializationFilter.All && serializationFilter !== Friday.Knockout.ViewModels.SerializationFilter.ObservablesOnly) return false;
    //Serialization mode set to Include Selected
    if (serializationMode === Friday.Knockout.ViewModels.SerializationMode.Include &&
        value.SerializationMode === Friday.Knockout.ViewModels.SerializationMode.Include) return true;

    //Serialization mode set to Exclude Selected
    if (serializationMode === Friday.Knockout.ViewModels.SerializationMode.Exclude &&
        value.SerializationMode !== Friday.Knockout.ViewModels.SerializationMode.Exclude) return true;

    //Filter not passed
    return false;

}

ko.ToDto = function (viewModel: Friday.Knockout.ViewModels.SerializableViewModel): object {
    let dto: object = {};
    let keys = Object.keys(viewModel);
    for (let i = 0; i < keys.length; i++) {
        let propName = keys[i];
        let propValue: any;

        if(propName === "SerializationFilter" || propName === "SerializationMode") continue;       

        if (ko.isObservable(viewModel[propName])) {
            if (isPassingFilters(viewModel.SerializationMode, viewModel.SerializationFilter, viewModel[propName])) {
                propValue = ko.unwrap(viewModel[propName]);
                if (isSerializable(propValue)) propValue = (viewModel[propName] as Friday.ValueTypes.ISerializable<any>).ToDto();
                dto[propName] = propValue;
            }
        } else if(viewModel.SerializationFilter !== Friday.Knockout.ViewModels.SerializationFilter.ObservablesOnly) {
            if (typeIsFunction(viewModel[propName])) continue;

            if (isSerializable(viewModel[propName]))
                propValue = (viewModel[propName] as Friday.ValueTypes.ISerializable<any>).ToDto();

            else propValue = viewModel[propName];
            dto[propName] = propValue;
        }

    }
    return dto;
}