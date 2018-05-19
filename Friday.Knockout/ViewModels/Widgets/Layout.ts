///<reference path="../../../Friday.Base/Extensions/Array/LINQ/Methods/Has.ts"/>
///<reference path="IWidgetOptions.ts"/>
/// <reference path="../../../Friday.Base/ValueObjects/Guid.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import EventHandler = Friday.Utility.EventHandler;
    import Guid = Friday.ValueTypes.Guid;

    export class Layout {
        public Id: Guid;
        public CoordinatesUpdated: EventHandler<Widget> = new EventHandler();
        public Grid: Grid;
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        private factory: WidgetFactory;
        public OnDragOver(target: any, event: any) {

        }

        public OnDrop(target: any, event: any) {
            let originalEvent: DragEvent = event.originalEvent;
            let offset = originalEvent.dataTransfer.getData("text/plain").split(',');
            let widget = this.Widgets().First(w => w.Id.Equals(offset[2])) as Widget;

            if (widget !== null) {
                let oldPosition = WidgetPosition.FromDto(widget.Position);
                widget.Position.Left(event.clientX + parseInt(offset[0], 10));
                widget.Position.Top(event.clientY + parseInt(offset[1], 10));
                this.Grid.AlignPositionToGrid(widget.Position);
                if(!widget.Position.Equals(oldPosition))
                    this.CoordinatesUpdated.Call(widget);
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
            widget.Dispose();
            this.Widgets.remove(widget);
            
        }

        private subscribeToWidgetEvents(widget: Widget) {
//            widget.OnSaveRequested.Subscribe((widget: Widget) => this.CoordinatesUpdated.Call(widget));
            if(widget.AutoWidth === false)
            widget.OnWidgetWidthResized.Subscribe((newDimension: KnockoutObservable<number>) => {
                newDimension(this.Grid.AlignSizeToGrid(newDimension(), this.Grid.HorizontalGridStepPx()));
                this.CoordinatesUpdated.Call(widget);
                })

            if (widget.AutoHeight === false)
            widget.OnWidgetHeightResized.Subscribe((newDimension: KnockoutObservable<number>) => {
                newDimension(this.Grid.AlignSizeToGrid(newDimension(), this.Grid.VerticalGridStepPx()));
                this.CoordinatesUpdated.Call(widget);
            })
        }

        public AddWidget(widget: Widget): Widget;
        public AddWidget(dto: ISavedWidgetDto): Widget;
        public AddWidget(x: any): Widget{
            if (x instanceof Widget) {
                let widget = x as Widget;
                this.Widgets.push(widget);
                this.subscribeToWidgetEvents(widget);

                return widget;
            } else {
                let dto = x;
                dto.Options.Wizard = false;
                let widget = this.factory.GetWidget(dto.Name, dto.Options);
                if (widget != null) {
                    if (typeof dto.Id === "undefined") {
                        widget.Id = Guid.NewGuid();
                        widget.Layout = this.Id;
                    } else {
                        widget.Id = dto.Id;
                        widget.Layout = dto.Layout;
                    }

                    if (widget.Size.Equals(WidgetSize.Zero)) {
                        widget.Size = WidgetSize.FromDto(widget.MinimumSize);

                        if (widget.Position.Equals(WidgetPosition.Zero))
                            widget.Position = this.Grid.AllocateSpace(widget.Size);
                        else this.Grid.AlignPositionToGrid(widget.Position);
                    }

                    this.subscribeToWidgetEvents(widget);

                    this.Widgets.push(widget);
                    return widget;
                }
                
            }
            
        }

        public AssignId(widget: Widget) {

        }

        public Save(): ILayoutConfiguration {
            let dto: ILayoutConfiguration = { Widgets: [] };
            this.Widgets().forEach(widget => {
                if (typeof widget !== "undefined" && widget !== null) dto.Widgets.push(widget.Save());
            });
            return dto;
        }

        constructor(cfg: IDashboardConfiguration, factory: WidgetFactory) {
            this.Grid = new Grid(cfg.HorizontalGridStepPx, cfg.VerticalGridStepPx);
            this.factory = factory;
        }
    }
}