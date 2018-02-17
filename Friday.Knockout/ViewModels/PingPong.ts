///<reference path="RoutedViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    import IMessage = Friday.Transport.IMessage;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import IMessageSend = Friday.Transport.IMessageSend;

    export class PingPongViewModel extends RoutedViewModel {

        protected registerRoutes(registry: IPacketRegistryRouteRegistration): void {
            registry.RegisterRoute(this.Pong.bind(this), this.pongMessageType);
        }

        private measureStart: number;
        private measureEnd: number;
        private pingMessage: IMessage;
        private pongMessageType: any;
        public RoundTripTime: KnockoutObservable<number> = ko.observable(0);

        constructor(pingMessage: IMessage, pongMesageType: any, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            this.pingMessage = pingMessage;
            this.pongMessageType = pongMesageType;
        }

        public Ping() {
            this.measureStart = Date.now();
            this.sendMessage(this.pingMessage);
        }

        public Pong() {
            this.measureEnd = Date.now();
            this.RoundTripTime((this.measureEnd - this.measureStart) / 2);
        }

    }
}