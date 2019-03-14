///<reference path="RoutedViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;

    export abstract class ReadOnlyRoutedViewModel extends RoutedViewModel {
        constructor(registry: IPacketRegistryRouteRegistration) {
            super({ SendMessage: () => {}}, registry);
        }
    }
}