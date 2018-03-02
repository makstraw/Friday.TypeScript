namespace Friday.Knockout.ViewModels.Widgets {
    export class WidgetPosition {
        Top: KnockoutObservable<number>;
        Left: KnockoutObservable<number>;

        constructor(top: number, left: number) {
            this.Top = ko.observable(top);
            this.Left = ko.observable(left);
        }
    }
}