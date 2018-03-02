///<reference path="../../../Friday.Base/Extensions/Array/Has.ts"/>
///<reference path="IWidgetDto.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
    import INamespaceObject = Friday.ValueTypes.INamespaceObject;
    import ITransport = Transport.ITransport;
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;

    class WidgetFactory {
        private availableWidgets: Array<string> = [];
        private namespace: INamespaceObject<Widget>;
        private transport: ITransport;
        private registry: IPacketRegistryRouteRegistration;

        constructor(widgetsNamespace: INamespaceObject<Widget>, transport: ITransport, registry: IPacketRegistryRouteRegistration) {
            this.namespace = widgetsNamespace;
            this.availableWidgets = this.scanNamespace(widgetsNamespace);
            this.transport = transport;
            this.registry = registry;
        }

        private scanNamespace(widgetsNamespace: INamespaceObject<Widget>): Array<string> {
            let output = Object.getOwnPropertyNames(widgetsNamespace);
            return output;
        }

        public GetWidget(name: string, options: IWidgetDto): Widget | null {
            if (this.availableWidgets.Has(name)) {
                let widget = (this.namespace[name] as any).FromDto(options, this.transport, this.registry) as Widget;
                return widget;
            }
            return null;
        }

    }

    export class Layout {
        public Grid: Grid;
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        private factory: WidgetFactory;
        public OnDragOver(target: any, event: any) {

        }

        public OnDrop(target: any, event: any) {
            let originalEvent: DragEvent = event.originalEvent;
            let offset = originalEvent.dataTransfer.getData("text/plain").split(',');

            let widget = this.Widgets.FindRecordByProperty('Id', offset[2]) as Widget;
            if (typeof widget != null) {
                widget.Position.Left(event.clientX + parseInt(offset[0], 10));
                widget.Position.Top(event.clientY + parseInt(offset[1], 10));
                this.Grid.AlignPositionToGrid(widget.Position);
            }
             
        }


        public OnDragLeave(target: any, event: any) {

        }

        public OnDragEnter(target: any, event: any) {

        }

        public AddWidget() {

        }

        public Save(): ILayoutConfiguration {
            let dto: ILayoutConfiguration = { Widgets: [] };
            for (let i = 0; i < this.Widgets().length; i++) {
                dto.Widgets.push(this.Widgets()[i].Save());
            }
            return dto;
        }

        constructor(cfg: IDashboardConfiguration, layout: ILayoutConfiguration) {
            this.Grid = new Grid(cfg.HorizontalGridStepPx, cfg.VerticalGridStepPx);
            this.factory = new WidgetFactory(cfg.Namespace, cfg.Transport, cfg.Registry);
            for (let i = 0; i < layout.Widgets.length; i++) {
                let widget = this.factory.GetWidget(layout.Widgets[i].Name, layout.Widgets[i].Options);
                if(widget != null) this.Widgets.push(widget);
            }

//            let widget = CurrencyPairWidget.FromDto({
//                    Period: 5,
//                    Pair: "BTC/USD",
//                    Exchange: Exchange.Bitfinex,
//                    Width: 180,
//                    Height: 200,
//                    Top: 25,
//                    Left: 25
//                },
//                cfg.Transport,
//                cfg.Registry);
//            this.Grid.AlignSizeToGrid(widget.Size, widget.MinimumSize, widget.MaximumSize);
//            this.Widgets.push(widget);
        }
    }
}