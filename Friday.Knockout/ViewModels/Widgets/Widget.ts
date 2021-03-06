﻿///<reference path="WidgetPosition.ts"/>
///<reference path="WidgetSize.ts"/>
///<reference path="IWidgetOptions.ts"/>
///<reference path="../../../Friday.Base/Utility/EventHandler.ts"/>
///<reference path="../../../Friday.Base/Extensions/StringExtensions.ts"/>
///<reference path="../../../Friday.Base/System/Interfaces/IDisposable.ts"/>
/// <reference path="../../../Friday.Base/ValueObjects/Guid.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import IMessageSend = Friday.Transport.IMessageSend;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import EventHandler = Friday.Utility.EventHandler;
    import IDisposable = Friday.System.IDisposable;
    import Guid = Friday.ValueTypes.Guid;
    import IEquatable = Friday.System.IEquatable;

    export abstract class Widget extends RoutedViewModel implements IDisposable, IEquatable<Widget>{
        protected DefaultConfiguration: IWidgetOptions;
        public Id: Guid;
        public Layout: Guid;
        public WidgetName: string;
        public Position: WidgetPosition;
        public Size: WidgetSize;
        public abstract readonly MinimumSize: WidgetSize;
        public abstract readonly MaximumSize: WidgetSize;

        public BackgroundColor: KnockoutObservable<string> = ko.observable(String.Empty);
        public FontColor: KnockoutObservable<string> = ko.observable(String.Empty);
        public FontSize: KnockoutObservable<string> = ko.observable(String.Empty);
        public OnSaveRequested: EventHandler<Widget> = new EventHandler<Widget>();
        public OnWidgetWidthResized: EventHandler<KnockoutObservable<number>> = new EventHandler<KnockoutObservable<number>>();
        public OnWidgetHeightResized: EventHandler<KnockoutObservable<number>> = new EventHandler<KnockoutObservable<number>>();
        public OnWidgetClicked: EventHandler<Widget> = new EventHandler<Widget>();

        public Draggable: KnockoutObservable<boolean> = ko.observable(true);
        public FullWidth: KnockoutObservable<boolean> = ko.observable(false);
        public FullHeight: KnockoutObservable<boolean> = ko.observable(false);
        public FullscreenAllowed: boolean = false;
        public AutoWidth: boolean = false;
        public AutoHeight: boolean = false;
        public FontAdjust: boolean = false;

        public Top: KnockoutComputed<string> = ko.pureComputed(function (this: Widget): string {
            if (this.FullHeight()) return "0";
            return this.Position.Top() + "px";
        }, this);

        public Left: KnockoutComputed<string> = ko.pureComputed(function (this: Widget): string {
            if (this.FullWidth()) return "0";
            return this.Position.Left() + "px";
        }, this);

        public Width: KnockoutComputed<string> = ko.pureComputed(function (this: Widget): string {
            if (this.FullWidth()) return "100%";
            if (this.AutoWidth) return "auto";
            return this.Size.Width() + "px";
        }, this);

        public Height: KnockoutComputed<string> = ko.pureComputed(function (this: Widget): string {
            if (this.FullHeight()) return "100%";
            if (this.AutoHeight) return "auto";
            return this.Size.Height() + "px";
        }, this);

        public Exception: KnockoutObservable<boolean> = ko.observable(false);



        protected abstract saveOptions(options: IWidgetOptions): IWidgetOptions;

        public Save(): ISavedWidgetDto {
            let options: IWidgetOptions = {
                Position: this.Position,
                Size: this.Size,
                FontColor: this.FontColor(),
                FontSize: this.FontSize(),
                BackgroundColor: this.BackgroundColor(),
                FullWidth: this.FullWidth(),
                FullHeight: this.FullHeight(),
            }
            options = this.saveOptions(options);


            let dto: ISavedWidgetDto = { Name: this.WidgetName, Options: ko.toJS(options), Id: this.Id, Layout: this.Layout };
            return dto;
        }

        protected koSubscriptions: Array<KnockoutSubscription> = [];

        public Dispose() {
            this.koSubscriptions.forEach(x => x.dispose());
            this.OnSaveRequested.UnsubscribeAll();
            this.OnWidgetHeightResized.UnsubscribeAll();
            this.OnWidgetWidthResized.UnsubscribeAll();
            this.OnWidgetClicked.UnsubscribeAll();
        }

        public FontStepUp() {
            let fontSize = parseFloat(this.FontSize());
            this.FontSize((fontSize += 0.1) + "rem");
        }

        public FontStepDown() {
            let fontSize = parseFloat(this.FontSize());
            if (fontSize <= 0.7) return;
            this.FontSize((fontSize -= 0.1) + "rem");
        }

        protected ApplyDefaultSize(options: IWidgetOptions) {
            if (WidgetSize.Zero.Equals(options.Size)) this.Size = WidgetSize.FromDto(this.DefaultConfiguration.Size);
            else this.Size = WidgetSize.FromDto(options.Size);
        }


        constructor(options: IWidgetOptions, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            this.WidgetName = (this.constructor as any).name;
            this.Size = WidgetSize.FromDto(options.Size);
            this.Position = WidgetPosition.FromDto(options.Position);
            this.FontColor(options.FontColor);
            this.FontSize(options.FontSize);
            this.BackgroundColor(options.BackgroundColor);
            if (typeof options.FullWidth !== "undefined")
                this.FullWidth(options.FullWidth)
            if (typeof options.FullHeight !== "undefined")
                this.FullHeight(options.FullHeight)
            this.subscribeToPropertyChanges();

        }

        public OnClick() {
            this.OnWidgetClicked.Call(this);
            return true;
        }

        public OnFullscreen() {
            this.Size.Height.notifySubscribers(this.Size.Height());
        }

        private subscribeToPropertyChanges() {
            this.koSubscriptions.push(this.FontSize.subscribe(() => this.OnSaveRequested.Call(this)));
            this.koSubscriptions.push(this.FontColor.subscribe(() => this.OnSaveRequested.Call(this)));
            this.koSubscriptions.push(this.BackgroundColor.subscribe(() => this.OnSaveRequested.Call(this)));
            this.koSubscriptions.push(this.FullWidth.subscribe(() => this.OnSaveRequested.Call(this)));
            this.koSubscriptions.push(this.FullHeight.subscribe(() => this.OnSaveRequested.Call(this)));
            this.koSubscriptions.push(this.Size.Width.subscribe(() => this.OnWidgetWidthResized.Call(this.Size.Width)));
            this.koSubscriptions.push(this.Size.Height.subscribe(() => this.OnWidgetHeightResized.Call(this.Size.Height)));
        }

        public Equals(other: Widget): boolean {
            return this === other || this.Id.Equals(other.Id);
        }
    }
}