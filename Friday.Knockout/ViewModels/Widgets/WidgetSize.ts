namespace Friday.Knockout.ViewModels.Widgets {
    import IEquatable = Friday.System.IEquatable;

    export class WidgetSize implements IEquatable<WidgetSize>{

        Width: KnockoutObservable<number>;
        Height: KnockoutObservable<number>;

        constructor(width: number, height: number) {
            this.Width = ko.observable(width).extend({ rateLimit: 100 });
            this.Height = ko.observable(height).extend({ rateLimit: 100 });
        }

        public static FromDto(dto: WidgetSize): WidgetSize {
            if (ko.isObservable(dto.Width)) return new WidgetSize(dto.Width() as any, dto.Height() as any);
            return new WidgetSize(dto.Width as any, dto.Height as any);
        }

        public static get Zero(): WidgetSize {
            return new WidgetSize(0, 0);
        }

        public Equals(other: WidgetSize): boolean {
            return this.Width() === other.Width() && this.Height() === other.Height();
        }
    }
}