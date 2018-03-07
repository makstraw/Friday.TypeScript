///<reference path="../../../Friday.Base/Extensions/Array/Has.ts"/>
///<reference path="IWidgetOptions.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
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

        public OnResize(target: Widget): boolean {
            target.Size.Height(parseInt($("#" + target.Id).css("height")));
            target.Size.Width(parseInt($("#" + target.Id).css("width")));
            return true;
        }

        public RemoveWidget(widget: Widget) {
            this.Widgets.remove(widget);
            widget.Destroy();
        }

        public AddWidget(dto: ISavedWidgetDto) {
            console.log(dto);
            let widget = this.factory.GetWidget(dto.Name, dto.Options);
            widget.Size = WidgetSize.FromDto(widget.MinimumSize);
            widget.Position = this.Grid.AllocateSpace(widget.Size);
            this.Widgets.push(widget);
        }

        public Save(): ILayoutConfiguration {
            let dto: ILayoutConfiguration = { Widgets: [] };
            for (let i = 0; i < this.Widgets().length; i++) {
                dto.Widgets.push(this.Widgets()[i].Save());
            }
            return dto;
        }

        constructor(cfg: IDashboardConfiguration, layout: ILayoutConfiguration, factory: WidgetFactory) {
            this.Grid = new Grid(cfg.HorizontalGridStepPx, cfg.VerticalGridStepPx);
            this.factory = factory;
            for (let i = 0; i < layout.Widgets.length; i++) {
                let widget = this.factory.GetWidget(layout.Widgets[i].Name, layout.Widgets[i].Options);
                if (widget != null) {
                    this.Widgets.push(widget);
                    widget.Size.Width.subscribe((newValue: number) => {
                        widget.Size.Width(this.Grid.AlignSizeToGrid(newValue, this.Grid.HorizontalGridStepPx()));
                    });

                    widget.Size.Height.subscribe((newValue: number) => {
                        widget.Size.Height(this.Grid.AlignSizeToGrid(newValue, this.Grid.VerticalGridStepPx()));
                    });
                }
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