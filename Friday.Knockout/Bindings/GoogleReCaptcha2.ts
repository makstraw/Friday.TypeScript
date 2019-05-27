namespace Friday.Knockout.BindingHandlers {
    import Parameters = ReCaptchaV2.Parameters;

    export interface ExtendedParameters extends Parameters {
        widgetId: KnockoutObservable<number>
    }

    export class GoogleReCaptcha2 implements KnockoutBindingHandler {

        public static init(element: HTMLElement,
            valueAccessor: () => ExtendedParameters,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel,
            bindingContext: KnockoutBindingContext): void {
            let value = valueAccessor();

            /*
             * We are creating nested div, which will be used as a target to Google Recaptcha
             * Do not try to apply any styles to it, or modify it other way. Google Script monitors
             * that node and denies any modification of this node, including browser tools
             */
            let target = document.createElement("div");
            element.append(target);
            let id = grecaptcha.render(target, value);
            value.widgetId(id);
        }

    }
}

interface KnockoutBindingHandlers {
    Recaptcha: KnockoutBindingHandler;
}

ko.bindingHandlers.Recaptcha = Friday.Knockout.BindingHandlers.GoogleReCaptcha2;