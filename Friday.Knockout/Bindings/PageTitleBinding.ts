namespace Friday.Knockout.BindingHandlers {
    export class PageTitleBinding implements KnockoutBindingHandler {
        public static update(element: HTMLElement,
            valueAccessor: () => string,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel,
            bindingContext: KnockoutBindingContext): void {
            let value = ko.unwrap(valueAccessor());
            document.title = value;
            element.innerText = value;
        }
    }
}


interface KnockoutBindingHandlers {
    PageTitle: KnockoutBindingHandler;
}


ko.bindingHandlers.PageTitle = Friday.Knockout.BindingHandlers.PageTitleBinding;