///<reference path="IWidgetOptions.ts"/>
/// <reference path="../../../Friday.Base/ValueObjects/Guid.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import Guid = Friday.ValueTypes.Guid;

    export interface ISavedWidgetDto {
        Name: string;
        Options: IWidgetOptions;
        Layout?: Guid;
        Id?: Guid;
    }
}