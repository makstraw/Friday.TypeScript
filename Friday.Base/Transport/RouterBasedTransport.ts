///<reference path="JsonWebSocketTransport.ts"/>
///<reference path="PacketRegistry.ts"/>
namespace Friday.Transport { 
    export abstract class RouterBasedTransport extends JsonWebSocketTransport {
        private registry: IPacketRegistryRouteFind;

        constructor(registry: IPacketRegistryRouteFind, connectionString: WebSocketConnectionString, options?: IJsonWebSocketOptions) {
            super(connectionString, options);
            this.registry = registry;
        }

        protected routeJsonMessage(message: IMessage): void {
            this.registry.FindRoute(message);
        }

        protected routeArrayBufferMessage(arrayBuffer: ArrayBuffer): void {
            var buffer = new Uint8Array(arrayBuffer);
            var type = buffer[0];
            this.registry.FindBinaryRoute(type, buffer);
        }
    }
}