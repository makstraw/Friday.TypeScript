namespace Friday.Knockout.ViewModels.Widgets {

    export interface IWidgetOptions {
        Size: WidgetSize;
        Position: WidgetPosition;
    }

    export interface IWidgetDto {
        Width: number;
        Height: number;
        Top: number;
        Left: number;
    }
}