namespace Friday.Knockout.ViewModels.Widgets {
    export class WidgetPosition {
        Top: KnockoutObservable<number>;
        Left: KnockoutObservable<number>;

        constructor(top: number, left: number) {
            this.Top = ko.observable(top);
            this.Left = ko.observable(left);
        }

        public static FromDto(dto: WidgetPosition): WidgetPosition {
            return new WidgetPosition(dto.Top as any, dto.Left as any);
        }

        public static get Zero(): WidgetPosition {
            return new WidgetPosition(0, 0);
        }
    }
}