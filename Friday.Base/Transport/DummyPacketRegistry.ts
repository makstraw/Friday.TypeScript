///<reference path="BasicMessage.ts"/>
///<reference path="IPacketRegistryRouteFind.ts"/>
///<reference path="IPacketRegistryRouteRegistration.ts"/>
namespace Friday.Transport {
    export class DummyPacketRegistry implements IPacketRegistryRouteFind, IPacketRegistryRouteRegistration {
        public FindRoute(packet: BasicMessage): void {

        }

        public FindBinaryRoute(type: number, buffer: Uint8Array): void {

        }

        public RegisterBinaryRoute(functionPointer: Function, packetType): void {

        }

        public RegisterRoute(functionPointer: Function, packetType): void {

        }
    }
}