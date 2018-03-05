///<reference path="WidgetPosition.ts"/>
///<reference path="WidgetSize.ts"/>
///<reference path="IWidgetDto.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
    import IMessageSend = Friday.Transport.IMessageSend;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;

    export abstract class Widget extends RoutedViewModel {
        public Id: string;
        public WidgetName: string;
        public Position: WidgetPosition;
        public Size: WidgetSize;
        public abstract readonly MinimumSize: WidgetSize;
        public abstract readonly MaximumSize: WidgetSize;

        public OnResize() {
            console.log(arguments);
        }

        public OnDragStart(target: Widget, event: any): boolean {
            let originalEvent: DragEvent = event.originalEvent;
            var style = window.getComputedStyle(originalEvent.target as Element, null);
            originalEvent.dataTransfer.effectAllowed = "move";
            originalEvent.dataTransfer.dropEffect = "move";
            originalEvent.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - originalEvent.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - originalEvent.clientY) + ','+(originalEvent.target as HTMLElement).getAttribute('id'));
            return true;
        }

        public OnDragEnd(event: DragEvent) {

        }

        public OnDragOver(vent: DragEvent) {

        }

        public OnDrop(event: DragEvent){

        }


        public OnDragLeave(event: DragEvent) {

        }

        public OnDragEnter(event: DragEvent) {

        }

        protected savePositionAndSize(): IWidgetDto {
            return {
                Width: this.Size.Width(),
                Height: this.Size.Height(),
                Top: this.Position.Top(),
                Left: this.Position.Left(),
            }
        }

        protected abstract saveOptions(options: IWidgetDto): IWidgetDto;

        public Save(): ISavedWidgetDto {
            let options = this.savePositionAndSize();
            options = this.saveOptions(options);


            let dto: ISavedWidgetDto = { Name: this.WidgetName, Options: options };
            return dto;
        }

        public abstract Setup();

        public abstract Destroy();


        constructor(options: IWidgetOptions, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            this.WidgetName = this.constructor.name;
            this.Size = options.Size;
            this.Position = options.Position;
        }
    }
}