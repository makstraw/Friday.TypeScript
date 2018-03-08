///<reference path="RouterBasedTransport.ts"/>
///<reference path="ITransport.ts"/>
namespace Friday.Transport {
    import EventHandler = Utility.EventHandler;
    import ILogger = Logging.ILogger;

    export interface IUniversalTransportOptions extends IJsonWebSocketOptions {
        ServerMessageEnum: object;
        ClientMessageEnum: object;
        ConnectionString: WebSocketConnectionString;
    }

    export class UniversalTransport extends RouterBasedTransport implements ITransport{
        private readonly serverMessageEnum: object;
        private readonly clientMessageEnum: object;

        public readonly OnOpen: EventHandler<void> = new EventHandler(this.isReady.bind(this));
        public readonly OnClose: EventHandler<CloseEvent> = new EventHandler();
        public readonly OnError: EventHandler<ErrorEvent> = new EventHandler();
        public readonly OnMessage: EventHandler<MessageEvent> = new EventHandler();

        protected messageTypeToString(messageType: any, direction: MessageTypeDirection): string {
            if (direction == "server") {
                return (<any>this.serverMessageEnum)[messageType];
            } else if (direction == "client") {
                return (<any>this.clientMessageEnum)[messageType];
            }
        }

        protected routeBlobMessage(blob: Blob): void { throw new Error("Not implemented"); }

        constructor(registry: IPacketRegistryRouteFind, logger: ILogger, options: IUniversalTransportOptions) {
            super(registry, options.ConnectionString, logger, options);

            this.serverMessageEnum = options.ServerMessageEnum;
            this.clientMessageEnum = options.ClientMessageEnum;
        }


        protected onOpenHandler(): void {
            super.onOpenHandler();
            this.OnOpen.Call();
        }

        protected onCloseHandler(event: CloseEvent): void {
            super.onCloseHandler(event);
            this.OnClose.Call();
        }

        protected onErrorHandler(event: ErrorEvent): void {
            this.OnError.Call(event);
        }

        protected onMessageHandler(event: MessageEvent): void {
            super.onMessageHandler(event);
            this.OnMessage.Call(event);
        }
    }
}