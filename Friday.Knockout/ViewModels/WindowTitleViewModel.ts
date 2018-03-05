/// <reference path="RoutedViewModel.ts" />
module Friday.Knockout.ViewModels {
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;
    import IMessageSend = Transport.IMessageSend;

    export abstract class WindowTitleViewModel extends RoutedViewModel {
        public readonly Title: KnockoutObservable<string>;

        constructor(initialValue: string, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            this.Title = ko.observable(initialValue);
            this.Title.subscribe(newTitle => document.title = newTitle);
        }
    }
}