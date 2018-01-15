///<reference path="../../Friday.Base/Transport/IMessageSend.ts"/>
///<reference path="../../Friday.Base/Transport/IPacketRegistryRouteRegistration.ts"/>
namespace Friday.Knockout.ViewModels {
    import IMessageSend = Friday.Transport.IMessageSend;

    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;

    export abstract class RoutedViewModel {
        protected sendMessage: Function;

        constructor(transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            this.sendMessage = transport.sendMessage.bind(transport);
            this.registerRoutes(registry);
        }

        protected abstract registerRoutes(registry: IPacketRegistryRouteRegistration): void;
    }
}