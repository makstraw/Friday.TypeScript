/// <reference path="../../../Friday.Base/Reflection/INamespaceObject.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import INamespaceObject = Friday.Reflection.INamespaceObject;

    export class WidgetWizard {
        private readonly widgetNotSelectedTemplate: string = "widget-not-selected";

        public Widget: KnockoutObservable<Widget> = ko.observable(null).extend({ Default: null });
        public readonly WidgetTypes: Array<string> = [];
        public readonly SelectedWidgetType: KnockoutObservable<string> = ko.observable("").extend({Default: ""});
        public readonly WidgetOptionsTemplateName: KnockoutObservable<string> = ko.observable(this.widgetNotSelectedTemplate).extend({ Default: this.widgetNotSelectedTemplate });
        private factory: WidgetFactory;

        constructor(namespace: INamespaceObject<Widget>, factory: WidgetFactory) {
            this.factory = factory;
            this.WidgetTypes = Friday.Reflection.ScanNamespace(namespace);
            this.SelectedWidgetType.subscribe(this.onWidgetTypeSelected.bind(this));

        }

        private onWidgetTypeSelected(newValue: string) {
            //if (this.Widget() != null) this.Widget().Destroy();

            if (!newValue || newValue == "") {
                this.WidgetOptionsTemplateName.Reset();
                this.Widget.Reset();
            } else {
                this.Widget(this.factory.GetWidget(newValue));
                this.WidgetOptionsTemplateName(newValue + "-options");
            }


        }

        public Save(): ISavedWidgetDto {
            let output = this.Widget().Save();
            this.SelectedWidgetType.Reset();
            return output;

        }

    }
}