namespace Friday.Transport {
    export interface IPacketRegistryRouteRegistration {
        RegisterBinaryRoute(functionPointer: Function, packetType: any): void;
        RegisterRoute(functionPointer: Function, packetType: any): void;
    }
}