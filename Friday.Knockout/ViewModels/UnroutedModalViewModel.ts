///<reference path="ModalViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import DummyTransport = Friday.Transport.DummyTransport;

    export abstract class UnroutedModalViewModel extends ModalViewModel {
        public MessageType: any = null;
        public Submit(): void { }

        protected registerRoutes(registry: IPacketRegistryRouteRegistration): void {

        }

        constructor() {
            super(new DummyTransport(), null);
        }

        protected toDto(): object { return null }
    }

}