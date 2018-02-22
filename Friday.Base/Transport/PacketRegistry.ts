///<reference path="BasicMessage.ts"/>
///<reference path="IPacketRegistryRouteFind.ts"/>
///<reference path="IPacketRegistryRouteRegistration.ts"/>
///<reference path="../Logging/ILogger.ts"/>
namespace Friday.Transport{
    import ILogger = Friday.Logging.ILogger;

    class PacketRegistryEntry {
        public PacketType: any;
        public FunctionPointer: Function;
    }

    export class PacketRegistry implements IPacketRegistryRouteFind, IPacketRegistryRouteRegistration {
        private readonly registry: Array<PacketRegistryEntry> = [];
        private readonly binaryRegistry: Array<PacketRegistryEntry> = [];
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

        public RegisterBinaryRoute(functionPointer: Function, packetType: any) {
            var route = new PacketRegistryEntry();
            route.PacketType = packetType;
            route.FunctionPointer = functionPointer;
            this.binaryRegistry.push(route);
        }

        public FindRoute(packet: BasicMessage) {
            let found: boolean = false;
            for (let i = 0; i < this.registry.length; i++) {
                if (this.registry[i].PacketType == packet.MessageType) {
                    this.logger.LogDebug(this.registry[i].FunctionPointer.toString());
                    this.registry[i].FunctionPointer(packet);
                    found = true;
                }
            }
            if(!found) this.logger.LogDebug("Route not found for: " + packet.MessageType);
        }

        public FindBinaryRoute(type: number, buffer: Uint8Array) {
            for (let i = 0; i < this.binaryRegistry.length; i++) {
                if (this.binaryRegistry[i].PacketType == type) {
                    this.logger.LogDebug(`Routing type ${type}, with buffer ${buffer.byteLength}`);
                    this.binaryRegistry[i].FunctionPointer(buffer);
                    return ;
                }
            }
            this.logger.LogDebug("Route not found for: " + type);
        }

    }
}