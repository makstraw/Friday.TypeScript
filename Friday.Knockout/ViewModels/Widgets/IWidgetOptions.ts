namespace Friday.Knockout.ViewModels.Widgets {

    export interface IWidgetOptions {
        Size: WidgetSize;
        Position: WidgetPosition;
        Wizard?: boolean;
        BackgroundColor?: string;
        FontColor?: string;
        FontSize?: string;
    }
}