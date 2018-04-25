﻿///<reference path="WidgetPosition.ts"/>
///<reference path="WidgetSize.ts"/>
///<reference path="IWidgetOptions.ts"/>
///<reference path="../../../Friday.Base/Utility/EventHandler.ts"/>
///<reference path="../../../Friday.Base/Extensions/StringExtensions.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
    import IMessageSend = Friday.Transport.IMessageSend;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import EventHandler = Friday.Utility.EventHandler;

    export abstract class Widget extends RoutedViewModel{
        public Id: string;
        public WidgetName: string;
        public Position: WidgetPosition;
        public Size: WidgetSize;
        public abstract readonly MinimumSize: WidgetSize;
        public abstract readonly MaximumSize: WidgetSize;
        public BackgroundColor: KnockoutObservable<string> = ko.observable(String.Empty);
        public FontColor: KnockoutObservable<string> = ko.observable(String.Empty);
        public FontSize: KnockoutObservable<string> = ko.observable(String.Empty);
        public OnSaveRequested: EventHandler<Widget> = new EventHandler<Widget>();
        public Draggable: KnockoutObservable<boolean> = ko.observable(true);
        public AutoWidth: boolean = false;
        public AutoHeight: boolean = false;

        public Exception: KnockoutObservable<boolean> = ko.observable(false);

        public OnDragStart(target: Widget, event: any): boolean {
            let originalEvent: DragEvent = event.originalEvent;
            var style = window.getComputedStyle(originalEvent.target as Element, null);
            originalEvent.dataTransfer.effectAllowed = "move";
            originalEvent.dataTransfer.dropEffect = "move";
            originalEvent.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - originalEvent.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - originalEvent.clientY) + ',' + (originalEvent.target as HTMLElement).getAttribute('id'));
            return true;
        }

        public OnDragEnd(event: DragEvent) {

        }

        public OnDragOver(event: DragEvent) {

        }

        public OnDrop(event: DragEvent) {

        }


        public OnDragLeave(event: DragEvent) {

        }

        public OnDragEnter(event: DragEvent) {

        }

        protected abstract saveOptions(options: IWidgetOptions): IWidgetOptions;

        public Save(): ISavedWidgetDto {
            let options: IWidgetOptions = {
                Position: this.Position,
                Size: this.Size,
                FontColor: this.FontColor(),
                FontSize: this.FontSize(),
                BackgroundColor: this.BackgroundColor()
            }
            options = this.saveOptions(options);


            let dto: ISavedWidgetDto = { Name: this.WidgetName, Options: ko.toJS(options) };
            return dto;
        }

        public abstract Setup();

        public abstract Destroy();

        public abstract Validate(): boolean;

        public FontStepUp() {
            let fontSize = parseFloat(this.FontSize());
            this.FontSize((fontSize += 0.5) + "rem");
        }

        public FontStepDown() {
            let fontSize = parseFloat(this.FontSize());
            if (fontSize === 1) return;
            this.FontSize((fontSize -= 0.5) + "rem");
        }

        constructor(options: IWidgetOptions, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            this.WidgetName = (this.constructor as any).name;
            this.Size = WidgetSize.FromDto(options.Size);
            this.Position = WidgetPosition.FromDto(options.Position);
            this.FontColor(options.FontColor);
            this.FontSize(options.FontSize);
            this.BackgroundColor(options.BackgroundColor);
            if (!options.Wizard) {
                this.FontSize.subscribe(() => this.OnSaveRequested.Call(this));
                this.FontColor.subscribe(() => this.OnSaveRequested.Call(this));
                this.BackgroundColor.subscribe(() => this.OnSaveRequested.Call(this));
            }
        }
    }
}