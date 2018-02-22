// ReSharper disable once InconsistentNaming
interface KnockoutExtenders {
    Serialize: (target: any, options: object) => void;
}

// ReSharper disable once InconsistentNaming
interface KnockoutObservable<T> {
    Serialize(target: any): object;
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

interface ISerializable<T> {
    Serialize(): T;
}

function isSerializable(value: any): boolean {
    return typeof value === "object" && value.hasOwnProperty("Serialize");
}

ko.ToDto = function (viewModel: Friday.Knockout.ViewModels.SerializableViewModel): object {
    let dto: object = {};
    for (let i = 0; i < Object.keys(viewModel).length; i++) {
        let propName = Object.keys(viewModel)[0];
    }
    return dto;
}