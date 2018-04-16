///<reference path="IDashboardConfiguration.ts"/>
///<reference path="Grid.ts"/>
///<reference path="ISavedWidgetDto.ts"/>
///<reference path="Widget.ts"/>
///<reference path="ILayoutConfiguration.ts"/>
///<reference path="WidgetFactory.ts"/>
///<reference path="WidgetWizard.ts"/>
///<reference path="Layout.ts"/>


namespace Friday.Knockout.ViewModels.Widgets {
    import EventHandler = Friday.Utility.EventHandler;
    import InvalidWidgetArguments = Friday.Exceptions.InvalidWidgetArguments;

    export class Dashboard {
        public OnWidgetCreated: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();
        public OnWidgetDeleted: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();
        public OnWidgetUpdated: EventHandler<ISavedWidgetDto> = new EventHandler<ISavedWidgetDto>();

        public EditMode: KnockoutObservable<boolean> = ko.observable(false);
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        

        public Layouts: KnockoutObservableArray<Layout> = ko.observableArray([]);
        public CurrentLayout: KnockoutObservable<Layout>;

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



        public ScrollLayout(currentLayout: Layout, event: JQueryEventObject) {
            let e = event.originalEvent as any;
            let delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
            let newCurrentLayout: Layout;
            if (delta > 0) newCurrentLayout = this.Layouts.FindNext(currentLayout);
            else newCurrentLayout = this.Layouts.FindPrev(currentLayout);
            if (newCurrentLayout !== null) this.CurrentLayout(newCurrentLayout);
        }


        public AddWidget(widget: Widget | Function) {
            if (typeof widget === "function") widget = (widget as Function)();
            this.CurrentLayout().AddWidget(widget as Widget);
        }

        public LoadWidget(dto: ISavedWidgetDto) {
            let layout = this.createOrGetLayout(dto.Layout);
            layout.AddWidget(dto);

        }

        public RemoveWidget(layout: Layout, widget: Widget, index?: number) {
            let dto = widget.Save();
            if (typeof index === "number") dto.Id = index;
            else dto.Id = layout.Widgets.FindRecordIndex(widget);
            dto.Layout = this.Layouts.FindRecordIndex(layout);
            layout.RemoveWidget(widget);
            this.OnWidgetDeleted.Call(dto);
        }

        public SaveWidget(widget: Widget) : ISavedWidgetDto {
            let dto = widget.Save();
            dto.Layout = this.Layouts.FindRecordIndex(this.CurrentLayout());
            dto.Id = this.CurrentLayout().Widgets.FindRecordIndex(widget);
            return dto;
        }

        public UpdateWidget(widget: Widget) {
            let dto = this.SaveWidget(widget)
            this.OnWidgetUpdated.Call(dto);
        }

        public AddLayout() {
            this.CurrentLayout(this.createLayout());
        }

        public ClearLayout() {
            while (this.CurrentLayout().Widgets().length > 0) {

                let widget = this.CurrentLayout().Widgets.pop();
                if (typeof widget !== "undefined" && widget !== null) {
//                    console.log(widget.Id, widget.Id.split('-'));
                    let index = parseInt(widget.Id.split('-')[1].split('w')[1]);
                    this.RemoveWidget(this.CurrentLayout(), widget, index);
                    widget.Destroy();
                }

            }
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
        

        private createOrGetLayout(index: number): Layout {
            let layout: Layout;
            if (typeof this.Layouts()[index] === "undefined") layout = this.createLayout(index);
            else layout = this.Layouts()[index];
            return layout;
        }

        private createLayout(index?: number): Layout {
            let layout = new Layout(this.cfg, this.factory);
            if (typeof index !== "undefined") {
                this.Layouts()[index] = layout;
                this.Layouts.notifySubscribers();
            } else {
                 this.Layouts.push(layout);
            }
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