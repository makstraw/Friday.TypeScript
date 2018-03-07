///<reference path="IDashboardConfiguration.ts"/>
///<reference path="Grid.ts"/>
///<reference path="ISavedWidgetDto.ts"/>
///<reference path="Widget.ts"/>
///<reference path="ILayoutConfiguration.ts"/>
///<reference path="WidgetFactory.ts"/>
///<reference path="WidgetWizard.ts"/>
///<reference path="Layout.ts"/>

namespace Friday.Knockout.ViewModels.Widgets {
    export class Dashboard {
        public EditMode: KnockoutObservable<boolean> = ko.observable(false);
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        

        public Layouts: KnockoutObservableArray<Layout> = ko.observableArray([]);
        public CurrentLayout: KnockoutObservable<Layout>;

        public Wizard: WidgetWizard;
        private factory: WidgetFactory;

        public Save(): Array<ILayoutConfiguration> {
            let dto: Array<ILayoutConfiguration> = [];
            for (let i = 0; i < this.Layouts().length; i++) {
                dto.push(this.Layouts()[i].Save());
            }
            return dto;
        }

        public CreateWidget() {
            this.CurrentLayout().AddWidget(this.Wizard.Save());
        }

        constructor(cfg: IDashboardConfiguration, savedLayouts: Array<ILayoutConfiguration>) {
            this.factory = new WidgetFactory(cfg.Namespace, cfg.Transport, cfg.Registry);
            this.Wizard = new WidgetWizard(cfg.Namespace, this.factory);

            for (let i = 0; i < savedLayouts.length; i++) {
                this.Layouts.push(new Layout(cfg,savedLayouts[i],this.factory));
            }
            this.CurrentLayout = ko.observable(this.Layouts()[0]);
        }
    }
}