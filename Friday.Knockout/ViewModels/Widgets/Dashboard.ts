///<reference path="IDashboardConfiguration.ts"/>
///<reference path="Grid.ts"/>
///<reference path="ISavedWidgetDto.ts"/>
///<reference path="Widget.ts"/>
///<reference path="ILayoutConfiguration.ts"/>
///<reference path="Layout.ts"/>

namespace Friday.Knockout.ViewModels.Widgets {

    export class Dashboard {
        public EditMode: KnockoutObservable<boolean> = ko.observable(false);
        public Widgets: KnockoutObservableArray<Widget> = ko.observableArray([]);
        

        public Layouts: KnockoutObservableArray<Layout> = ko.observableArray([]);
        public CurrentLayout: KnockoutObservable<Layout>;

        public Save(): Array<ILayoutConfiguration> {
            let dto: Array<ILayoutConfiguration> = [];
            for (let i = 0; i < this.Layouts().length; i++) {
                dto.push(this.Layouts()[i].Save());
            }
            return dto;
        }

        constructor(cfg: IDashboardConfiguration, savedLayouts: Array<ILayoutConfiguration>) {
            for (let i = 0; i < savedLayouts.length; i++) {
                this.Layouts.push(new Layout(cfg,savedLayouts[i]));
            }
            this.CurrentLayout = ko.observable(this.Layouts()[0]);
        }
    }
}