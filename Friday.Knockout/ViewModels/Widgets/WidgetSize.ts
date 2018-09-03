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

        public static get FullScreen(): WidgetSize {
            return new WidgetSize(screen.width, screen.height);
        }

        public static get Huge(): WidgetSize {
            return new WidgetSize(4096, 2160);
        }

        public static get FullHD(): WidgetSize {
            return new WidgetSize(1920, 1080);
        }

        public static get HD(): WidgetSize {
            return new WidgetSize(1280, 720);
        }

        public Equals(other: WidgetSize): boolean {
            return this.Width() === ko.unwrap(other.Width) && this.Height() === ko.unwrap(other.Height);
        }
    }
}