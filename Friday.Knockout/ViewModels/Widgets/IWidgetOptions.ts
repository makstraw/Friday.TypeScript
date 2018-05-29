namespace Friday.Knockout.ViewModels.Widgets {

    export interface IWidgetOptions {
        Size: WidgetSize;
        Position: WidgetPosition;
        FullWidth: boolean;
        FullHeight: boolean;
        BackgroundColor?: string;
        FontColor?: string;
        FontSize?: string;
    }
}