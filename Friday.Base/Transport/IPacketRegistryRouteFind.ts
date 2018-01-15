namespace Friday.Transport {
    export interface IPacketRegistryRouteFind {
        FindRoute(packet: BasicMessage): void;
        FindBinaryRoute(type: number,buffer: Uint8Array): void;
    }
}