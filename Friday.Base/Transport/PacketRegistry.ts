﻿///<reference path="BasicMessage.ts"/>
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
        private readonly unhandledRegistry: Array<PacketRegistryEntry> = [];
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

        public RegisterUnhandledRoute(functionPointer: Function, packetType: any): void {
            var route = new PacketRegistryEntry();
            route.PacketType = packetType;
            route.FunctionPointer = functionPointer;

            this.unhandledRegistry.push(route);
        }

        public FindRoute(packet: BasicMessage) {
            let found: boolean = false;
            let handled: boolean = false;
            for (let i = 0; i < this.registry.length; i++) {
                if (this.registry[i].PacketType === packet.MessageType) {
                    this.logger.LogDebug(this.registry[i].FunctionPointer.name);
                    try {
                        handled = this.registry[i].FunctionPointer(packet) || handled;
                    } catch (e) {
                        this.logger.LogDebug("Route throws unhandled exception", e);
                        throw e;
                    } finally {
                        found = true;
                    }                    
                }
            }
            if (!handled) found = this.findUnhandledRoute(packet) || found;
            if (!found) this.logger.LogDebug(`Route not found for: ${packet.MessageType}`);
        }

        private findUnhandledRoute(packet: BasicMessage): boolean {
            let found: boolean = false;
            for (let i = 0; i < this.unhandledRegistry.length; i++) {
                if (this.unhandledRegistry[i].PacketType === packet.MessageType) {
                    this.logger.LogDebug(this.registry[i].FunctionPointer.name);
                    this.unhandledRegistry[i].FunctionPointer(packet);
                    found = true;
                }
            }
            return found;
        }

        public FindBinaryRoute(type: number, buffer: Uint8Array) {
            for (let i = 0; i < this.binaryRegistry.length; i++) {
                if (this.binaryRegistry[i].PacketType === type) {
                    this.logger.LogDebug(`Routing type ${type}, with buffer ${buffer.byteLength}`);
                    this.binaryRegistry[i].FunctionPointer(buffer);
                    return ;
                }
            }
            this.logger.LogDebug("Route not found for: " + type);
        }

    }
}