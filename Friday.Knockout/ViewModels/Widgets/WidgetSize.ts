namespace Friday.Knockout.ViewModels.Widgets {
    export class WidgetSize {
        Width: KnockoutObservable<number>;
        Height: KnockoutObservable<number>;

        constructor(width: number, height: number) {
            this.Width = ko.observable(width).extend({ rateLimit: 100 });
            this.Height = ko.observable(height).extend({ rateLimit: 100 });
        }
    }
}