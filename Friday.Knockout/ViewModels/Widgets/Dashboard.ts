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
            let dto = this.Wizard.Save();
       
            let widget = this.CurrentLayout().AddWidget(dto);
            dto = this.SaveWidget(widget);
            this.OnWidgetCreated.Call(dto);
        }

        public LoadWidget(dto: ISavedWidgetDto) {
            let layout = this.createOrGetLayout(dto.Layout)
            layout.AddWidget(dto);

        }

        public RemoveWidget(layout: Layout, widget: Widget) {
            let dto = widget.Save();
            dto.Id = layout.Widgets.FindRecordIndex(widget);
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

        private createOrGetLayout(index: number): Layout {
            let layout: Layout;
            if (typeof this.Layouts()[index] === "undefined") layout = this.createLayout(index);
            else layout = this.Layouts()[index];
            return layout;
        }

        private createLayout(index?: number) : Layout {
            let layout = new Layout(this.cfg, this.factory);
            if (typeof index !== "undefined") {
                this.Layouts()[index] = layout;
                this.Layouts.notifySubscribers();
            }
            else this.Layouts.push(layout);
            if (typeof this.CurrentLayout === "undefined" || this.CurrentLayout() === null) this.CurrentLayout = ko.observable(layout);
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