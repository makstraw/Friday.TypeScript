///<reference path="BasicMessage.ts"/>
namespace Friday.Transport{
    import ILogger = Friday.Logging.ILogger;

    export class PacketRegistryEntry {
        public PacketType: any;
        public FunctionPointer: Function;
    }

    export interface IPacketRegistryRouteRegistration {
        RegisterBinaryRoute(functionPointer: Function): void;
        RegisterRoute(functionPointer: Function, packetType: any): void;
    }

    export interface IPacketRegistryRouteFind {
        FindRoute(packet: BasicMessage): void;
        FindBinaryRoute(buffer: ArrayBuffer): void;
    }

    export class PacketRegistry {
        private readonly registry: Array<PacketRegistryEntry> = [];
        private binaryRoute: PacketRegistryEntry;
        private logger: ILogger;

        constructor(logger: ILogger) {
            this.logger = logger;
        }

        public RegisterRoute(functionPointer: Function, packetType: any) {
            var route = new PacketRegistryEntry();
            route.PacketType = packetType;
            route.FunctionPointer = functionPointer;

            this.registry.push(route);
        }

        public RegisterBinaryRoute(functionPointer: Function) {
            this.binaryRoute = new PacketRegistryEntry();
            this.binaryRoute.FunctionPointer = functionPointer;
        }

        public FindRoute(packet: BasicMessage) {
            for (let i = 0; i < this.registry.length; i++) {
                if (this.registry[i].PacketType == packet.MessageType) {
                    this.logger.LogDebug(this.registry[i].FunctionPointer.toString());
                    this.registry[i].FunctionPointer(packet);
                    break;
                }
            }
            this.logger.LogDebug("Route not found for: " + packet.MessageType);
        }

        public FindBinaryRoute(buffer: ArrayBuffer) {
            this.binaryRoute.FunctionPointer(buffer);
        }

    }
}