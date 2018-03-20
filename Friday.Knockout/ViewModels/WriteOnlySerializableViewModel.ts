///<reference path="SerializableViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    import IMessageSend = Transport.IMessageSend;
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;

    export abstract class WriteOnlySerializableViewModel extends SerializableViewModel {
        protected registerRoutes(registry: IPacketRegistryRouteRegistration): void {

        }

        constructor(transport: IMessageSend) {
            super(transport,null);
        }
    }
}