namespace Friday.Knockout.ViewModels.Widgets {
    import IEquatable = Friday.System.IEquatable;
    export class WidgetPosition implements IEquatable<WidgetPosition>{
        Equals(other: WidgetPosition): boolean {
            return this.Top() === other.Top() && this.Left() === other.Left();
        }

        Top: KnockoutObservable<number>;
        Left: KnockoutObservable<number>;

        constructor(top: number, left: number) {
            this.Top = ko.observable(top).extend({rateLimit: 100});
            this.Left = ko.observable(left).extend({ rateLimit: 100 });
        }

        public static FromDto(dto: WidgetPosition): WidgetPosition {
            return new WidgetPosition(dto.Top as any, dto.Left as any);
        }

        public static get Zero(): WidgetPosition {
            return new WidgetPosition(0, 0);
        }
    }
}