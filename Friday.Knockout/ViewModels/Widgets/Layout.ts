///<reference path="../../../Friday.Base/Extensions/Array/LINQ/Methods/Has.ts"/>
///<reference path="IWidgetOptions.ts"/>
/// <reference path="../../../Friday.Base/ValueObjects/Guid.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import EventHandler = Friday.Utility.EventHandler;
    import Guid = Friday.ValueTypes.Guid;
    import ArgumentException = Friday.Exceptions.ArgumentException;

    type Position = "Top" | "Bottom" | "Left" | "Right" | "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight" | "Full";

    export class Layout {
        public Id: Guid;
        public CoordinatesUpdated: EventHandler<Widget> = new EventHandler<Widget>();
        public WidgetsOrderUpdated: EventHandler<Layout> = new EventHandler<Layout>();
        public Grid: Grid;
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        public WidgetsOrder: KnockoutObservableArray<Guid> = ko.observableArray([]).extend({rateLimit: 100});
        private factory: WidgetFactory;

        public IsEmpty: KnockoutComputed<boolean> = ko.pureComputed(function(this: Layout): boolean {
            return this.Widgets().length === 0;
        },this);

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

        private bringWidgetToFront(widget: Widget) {
            if (!this.WidgetsOrder().Last().Equals(widget.Id)) {
                this.WidgetsOrder.remove(this.WidgetsOrder().First(guid => guid.Equals(widget.Id)))
                this.WidgetsOrder.push(widget.Id);
                this.WidgetsOrderUpdated.Call(this);
            }
        }

        private addWidgetToFront(widget: Widget) {
            this.WidgetsOrder.push(widget.Id);
            this.WidgetsOrderUpdated.Call(this);
        }

        private subscribeToWidgetEvents(widget: Widget) {
            widget.OnSaveRequested.Subscribe((widget: Widget) => this.CoordinatesUpdated.Call(widget));
            widget.OnWidgetClicked.Subscribe((widget: Widget) => {
                this.bringWidgetToFront(widget);
            });

            if (widget.AutoWidth === false)
                widget.OnWidgetWidthResized.Subscribe((newDimension: KnockoutObservable<number>) => {
                    newDimension(this.Grid.AlignSizeToGrid(newDimension(), this.Grid.HorizontalGridStepPx()));
                    this.CoordinatesUpdated.Call(widget);
                });

            if (widget.AutoHeight === false)
                widget.OnWidgetHeightResized.Subscribe((newDimension: KnockoutObservable<number>) => {
                    newDimension(this.Grid.AlignSizeToGrid(newDimension(), this.Grid.VerticalGridStepPx()));
                    this.CoordinatesUpdated.Call(widget);
                });
        }

        public AddWidget(widget: Widget): Widget;
        public AddWidget(dto: ISavedWidgetDto): Widget;
        public AddWidget(x: any): Widget{
            if (x instanceof Widget) {
                let widget = x as Widget;
                this.Widgets.push(widget);
                this.subscribeToWidgetEvents(widget);
                this.addWidgetToFront(widget);
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
                    this.addWidgetToFront(widget);
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

        public MoveTo(widget: Widget, position: Position) {
            let top, left, width, height: number;

            let layout = $("#" + this.Id)[0];
            let widgetElement = $("#" + widget.Id)[0];

            switch (position) {
                case "Top":
                    if (widget.AutoWidth) {
                        left = layout.clientWidth / 2 - widgetElement.clientWidth / 2;
                        width = widgetElement.clientWidth;
                    } else {
                        left = 0;
                        width = layout.clientWidth
                    }

                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {

                        height = Math.floor(layout.clientHeight / 2);
                    }

                    top = 0;
                    break;

                case "Bottom":
                    if (widget.AutoWidth) {
                        left = layout.clientWidth / 2 - widgetElement.clientWidth / 2;
                        width = widgetElement.clientWidth;
                    } else {
                        left = 0;
                        width = layout.clientWidth
                    }

                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {
                        height = Math.floor(layout.clientHeight / 2);
                    }

                    top = layout.clientHeight - height;
                    break;

                case "Left":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);
                    }

                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                        top = layout.clientHeight / 2 - widgetElement.clientHeight / 2;
                    } else {
                        top = 0;
                        height = layout.clientHeight;
                    }

                    left = 0;


                    break;
                case "Right":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);
                    }
                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                        top = layout.clientHeight / 2 - widgetElement.clientHeight / 2;
                    } else {
                        top = 0;
                        height = layout.clientHeight;
                    }
                    left = layout.clientWidth - width;
                    break;

                case "TopLeft":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);
                    }
                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {
                        height = Math.floor(layout.clientHeight / 2);
                    }
                    top = 0;
                    left = 0;


                    break;

                case "TopRight":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);

                    }
                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {
                        height = Math.floor(layout.clientHeight / 2);
                    }

                    top = 0;
                    left = layout.clientWidth - width


                    break;

                case "BottomLeft":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);
                    }
                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {
                        height = Math.floor(layout.clientHeight / 2);
                    }
                    left = 0;
                    top = layout.clientHeight - height;
                    break;

                case "BottomRight":
                    if (widget.AutoWidth) {
                        width = widgetElement.clientWidth;
                    } else {
                        width = Math.floor(layout.clientWidth / 2);
                    }
                    if (widget.AutoHeight) {
                        height = widgetElement.clientHeight;
                    } else {
                        height = Math.floor(layout.clientHeight / 2);
                    }


                    top = layout.clientHeight - height;
                    left = layout.clientWidth - width;
                    break;

                case "Full":
                    if (widget.AutoWidth) {
                        left = layout.clientWidth / 2 - widgetElement.clientWidth / 2;
                        width = widgetElement.clientWidth;
                    } else {
                        width = layout.clientWidth;
                        left = 0;
                    }

                    if (widget.AutoHeight) {
                        top = layout.clientHeight / 2 - widgetElement.clientHeight / 2;
                        height = widgetElement.clientHeight;
                    } else {
                        height = layout.clientHeight;
                        top = 0;
                    }

                    break;
                default:
                    throw new ArgumentException("position");
            }
            widget.Position.Top(top);
            widget.Position.Left(left);
            widget.Size.Width(width);
            widget.Size.Height(height);
//            this.Grid.AlignPositionToGrid(widget.Position);
            widget.OnSaveRequested.Call(widget);
        }


        constructor(cfg: IDashboardConfiguration, factory: WidgetFactory) {
            this.Grid = new Grid(cfg.HorizontalGridStepPx, cfg.VerticalGridStepPx);
            this.factory = factory;
        }
    }
}