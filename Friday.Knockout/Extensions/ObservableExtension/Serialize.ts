///<reference path="../../../Friday.Base/System/Interfaces/ISerializable.ts" />
///<reference path="../../../Friday.Knockout/Models/SerializableModel.ts"/>
///<reference path="../../../Friday.Base/Extensions/Array/LINQ/linq_reference.ts"/>
///<reference path="../../../Friday.Base/Exceptions/Basic/ArgumentOutOfRangeException.ts"/>
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
}

// ReSharper disable once InconsistentNaming
interface KnockoutObservable<T> {
    SerializationMode: Friday.Knockout.Types.SerializationMode;
    FieldName?: string;
}

interface KnockoutStatic {
    ToDto(model: Friday.Knockout.Models.SerializableModel<any>): object;
    ToDto(viewModel: Friday.Knockout.ViewModels.SerializableViewModel): object;
}





namespace Friday.Knockout.Serialization {
    import SerializationMode = Friday.Knockout.Types.SerializationMode;
    import SerializationFilter = Friday.Knockout.Types.SerializationFilter;
    import ISerializable = Friday.System.ISerializable;
    import SerializableViewModel = Friday.Knockout.ViewModels.SerializableViewModel;
    import SerializableModel = Friday.Knockout.Models.SerializableModel;
    import ArgumentOutOfRangeException = Friday.Exceptions.ArgumentOutOfRangeException;
    import IKnockoutSerializable = Friday.Knockout.Types.IKnockoutSerializable;

    const reservedSerializationFields = ["SerializationFilter", "SerializationMode", "SerializationFields"];

    function typeIsPrimitive(value: any): boolean {
        return typeof value === "number" || typeof value === "boolean" || typeof value === "string";
    }

    function typeIsFunction(value: any): boolean {
        return typeof value === "function";
    }

    function isSerializable(value: any): boolean {
        return value !== null && typeof value === "object" && typeof value["ToDto"] === "function";
    }

    function isObservablePassingFilters(serializationMode: SerializationMode, value: KnockoutObservable<any>): boolean {
        //Serialization mode set to Include Selected
        if (serializationMode === SerializationMode.Include && value.SerializationMode === SerializationMode.Include) return true;
        //Serialization mode set to Exclude Selected
        if (serializationMode === SerializationMode.Exclude && value.SerializationMode !== SerializationMode.Exclude) return true;
        //Filter not passed
        return false;
    }

    

    function isPassingPreFilter(viewModel: IKnockoutSerializable<any>, propName: string, property: any): boolean {
        if (reservedSerializationFields.Has(propName)) return false;
        if (!ko.isObservable(property) && typeIsFunction(property)) return false;

        switch (viewModel.SerializationFilter) {
            case SerializationFilter.All:
                return true;

            case SerializationFilter.ObservablesOnly:
                if(ko.isObservable(property)) return true;
                break;

            case SerializationFilter.NonObservablesOnly:
                if (!ko.isObservable(property)) return true;
                break;

            case SerializationFilter.PrimitivesOnly:
                if (typeIsPrimitive(property)) return true;
                break;

            case SerializationFilter.FieldsFilterOnly:
                if (viewModel.SerializationFields.Has(propName)) return true;
                break;

            default:
                throw new ArgumentOutOfRangeException("SerializationFilter");
        }
        return false;
    }

    export function KnockoutToDto(viewModel: SerializableViewModel | SerializableModel<any>): object {
        
        let dto: object = {};
        let keys = Object.keys(viewModel);

        if (viewModel.SerializationFields.Count() > 0) {
            if (viewModel.SerializationMode === SerializationMode.Include)
                keys = keys.Intersect(viewModel.SerializationFields);
            else keys = keys.Except(viewModel.SerializationFields);
        }

        keys.forEach((propName: string) => {
            let propValue: any;
            let property = viewModel[propName];

            if (!isPassingPreFilter(viewModel, propName, property)) return;

            if (ko.isObservable(property)) {
                if (viewModel.SerializationFilter === SerializationFilter.FieldsFilterOnly || isObservablePassingFilters(viewModel.SerializationMode, property)) {
                    propValue = ko.unwrap(property);

                    if (isSerializable(propValue))
                        propValue = (propValue as ISerializable<any>).ToDto();
                    if (typeof (property as KnockoutObservable<any>).FieldName !== "undefined")
                        propName = property.FieldName;
                }
            } else {
                if (isSerializable(property))
                    propValue = (property as ISerializable<any>).ToDto();
                else propValue = viewModel[propName];
            }
            if (typeof propValue !== "undefined")
                (dto as any)[propName] = propValue;
        });

        return dto;
    }
}



ko.ToDto = Friday.Knockout.Serialization.KnockoutToDto;