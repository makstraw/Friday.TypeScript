/// <reference path="../../../Friday.Base/Reflection/INamespaceObject.ts" />
///<reference path="../../Exceptions/InvalidWidgetArguments.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
    import INamespaceObject = Friday.Reflection.INamespaceObject;
    import InvalidWidgetArguments = Friday.Exceptions.InvalidWidgetArguments;

    export class WidgetWizard {
        public DefaultPosition: WidgetPosition = WidgetPosition.Zero;
        public readonly Display: KnockoutObservable<boolean> = ko.observable(false).extend({ notify: 'always' });
        public readonly ArgumentError: KnockoutObservable<boolean> = ko.observable(false);
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
            this.Display.subscribe(() => this.DefaultPosition = WidgetPosition.Zero);
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
            this.Widget().Position = this.DefaultPosition;
            let output = this.Widget().Save();
            this.SelectedWidgetType.Reset();
            return output;

        }

    }
}