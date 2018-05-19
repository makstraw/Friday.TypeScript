///<reference path="IDashboardConfiguration.ts"/>
///<reference path="Grid.ts"/>
///<reference path="ISavedWidgetDto.ts"/>
///<reference path="Widget.ts"/>
///<reference path="ILayoutConfiguration.ts"/>
///<reference path="WidgetFactory.ts"/>
///<reference path="WidgetWizard.ts"/>
///<reference path="Layout.ts"/>
/// <reference path="../../../Friday.Base/ValueObjects/Guid.ts" />
///<reference path="../../../Friday.Base/Extensions/Array/LINQ/linq_reference.ts"/>
/// <reference path="../../../Friday.Base/Exceptions/Basic/ArgumentException.ts" />


namespace Friday.Knockout.ViewModels.Widgets {
    import EventHandler = Friday.Utility.EventHandler;
    import InvalidWidgetArguments = Friday.Exceptions.InvalidWidgetArguments;
    import Guid = Friday.ValueTypes.Guid;
    import ArgumentException = Friday.Exceptions.ArgumentException;

    export class Dashboard {
        public OnWidgetCreated: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();
        public OnWidgetDeleted: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();
        public OnWidgetUpdated: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();

        public EditMode: KnockoutObservable<boolean> = ko.observable(false);
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        

        public Layouts: KnockoutObservableArray<Layout> = ko.observableArray([]);
        public CurrentLayout: KnockoutObservable<Layout>;

        public IsFirstLayout: KnockoutComputed<boolean> = ko.pureComputed(function (): boolean {
            if (typeof this.CurrentLayout === "undefined") return true;
            return this.Layouts().First() === this.CurrentLayout();
        },this);

        public IsLastLayout: KnockoutComputed<boolean> = ko.pureComputed(function (): boolean {
            if (typeof this.CurrentLayout === "undefined") return true;
            return this.Layouts().Last() === this.CurrentLayout();
        },this);

        public Wizard: WidgetWizard;
        private factory: WidgetFactory;
        private cfg: IDashboardConfiguration;

        public Save(): Array<ILayoutConfiguration> {
            let dto: Array<ILayoutConfiguration> = [];
            for (let i = 0; i < this.Layouts().length; i++) {
                dto.push(this.Layouts()[i].Save());
            }
            return dto;
        }

        public AssignId() {

        }

        public CreateWidget() {
            let dto: ISavedWidgetDto;
            try {
                dto = this.Wizard.Save();
                this.Wizard.ArgumentError(false);
                let widget = this.CurrentLayout().AddWidget(dto);
                dto = this.SaveWidget(widget);
                this.OnWidgetCreated.Call(dto);
                this.Wizard.Display(false);
            } catch (e) {
                if (e instanceof InvalidWidgetArguments) {
                    this.Wizard.ArgumentError(true);
                }
            }

        }

        private getPreviousLayout(): Layout {
            return this.Layouts.FindPrev(this.CurrentLayout());
        }

        private getNextLayout(): Layout {
            return this.Layouts.FindNext(this.CurrentLayout());
        }

        public MoveWidgetToNextLayout(widget: Widget) {
            let nextLayout = this.getNextLayout();

            if (nextLayout !== null) {
                let dto = widget.Save()
                dto.Layout = nextLayout.Id;
                this.RemoveWidget(this.CurrentLayout(), widget);
                widget = nextLayout.AddWidget(dto);
                widget.OnSaveRequested.Call(widget);
            }
                
        }

        public MoveWidgetToPreviousLayout(widget: Widget) {
            let prevLayout = this.getPreviousLayout();
            if (prevLayout !== null) {
                let dto = widget.Save()
                dto.Layout = prevLayout.Id;
                this.RemoveWidget(this.CurrentLayout(),widget);
                widget = prevLayout.AddWidget(dto);
                widget.OnSaveRequested.Call(widget);
            }
                
        }

        public MoveWidgetToNewLayout(widget: Widget) {
            let dto = widget.Save();
            let layout = this.createLayout();
            dto.Layout = layout.Id;
            this.RemoveWidget(this.CurrentLayout(), widget);
            widget = layout.AddWidget(dto);
            widget.OnSaveRequested.Call(widget);;
        }


        public ScrollLayout(currentLayout: Layout, event: JQueryEventObject) {
            let e = event.originalEvent as any;
            let delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
            let newCurrentLayout: Layout;
            if (delta > 0) newCurrentLayout = this.Layouts.FindNext(currentLayout);
            else newCurrentLayout = this.Layouts.FindPrev(currentLayout);
            if (newCurrentLayout !== null) this.CurrentLayout(newCurrentLayout);
        }


        public AddWidget(widget: Widget | Function) {
            if (typeof widget === "function") widget = (widget as Function)() as Widget;
            if (typeof widget.Id === "undefined") widget.Id = Guid.NewGuid();
            this.CurrentLayout().AddWidget(widget as Widget);
        }

        public async LoadWidget(dto: ISavedWidgetDto) {
            let layout = this.createOrGetLayout(dto.Layout);
            layout.AddWidget(dto);

        }

        public RemoveWidget(layout: Layout, id: Guid);
        public RemoveWidget(layout: Layout, widget: Widget);
        public RemoveWidget(layout: Layout, x: Guid | Widget) {
            if (x === null) throw new ArgumentException("id/widget");

            let widget: Widget;
            if (x instanceof Guid && Guid.IsGuid(x)) {
                widget = layout.Widgets().First(x => x.Id.Equals(x));
                if (widget === null) throw new ArgumentException("id");
            } else if (x instanceof Widget) {
                widget = x;
            } else {
                throw new ArgumentException("widget");
            }

            let dto = widget.Save();

            layout.RemoveWidget(widget);
            this.OnWidgetDeleted.Call(dto);
        }

        public SaveWidget(widget: Widget) : ISavedWidgetDto {
            let dto = widget.Save();
            return dto;
        }

        public UpdateWidget(widget: Widget) {
            let dto = this.SaveWidget(widget);
            this.OnWidgetUpdated.Call(dto);
        }

        public AddLayout() {
            this.CurrentLayout(this.createLayout());
        }

        public ClearLayout() {
            this.CurrentLayout().Widgets().forEach(widget => {
                widget.Dispose();
                this.RemoveWidget(this.CurrentLayout(), widget);
            });
        }

        public ClearAll() {
            this.Layouts().forEach(layout => {
                if (layout instanceof Layout) {
                    this.CurrentLayout(layout);
                    this.ClearLayout();
                }
            });
            this.Layouts.removeAll();
            this.CurrentLayout(null);
        }
        

        private createOrGetLayout(id: Guid): Layout {
            let layout: Layout= this.Layouts().First(x => x.Id.Equals(id));
            if (typeof layout === "undefined" || layout === null) layout = this.createLayout(id);
            
            return layout;
        }

        private createLayout(id?: Guid): Layout {
            let layout = new Layout(this.cfg, this.factory);
            if (typeof id !== "undefined") {
                layout.Id = id;
            } else {
                layout.Id = Guid.NewGuid();
            }
            this.Layouts.push(layout);

            if (typeof this.CurrentLayout === "undefined") this.CurrentLayout = ko.observable(layout);
            if (this.CurrentLayout() === null) this.CurrentLayout(layout);

            layout.CoordinatesUpdated.Subscribe(this.UpdateWidget.bind(this));

            return layout;
        }

        constructor(cfg: IDashboardConfiguration) {
            this.cfg = cfg;
            this.factory = new WidgetFactory(cfg.Namespace, cfg.Transport, cfg.Registry);
            this.Wizard = new WidgetWizard(cfg.Namespace, this.factory);
            this.createLayout();
        }
    }
}