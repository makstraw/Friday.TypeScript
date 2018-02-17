///<reference path="WebSocketTransport.ts"/>
namespace Friday.Transport {
    export type EnumSerializationType = "string" | "number";
    export type MessageTypeDirection = "peer" | "server" | "client";

    export interface IJsonWebSocketOptions extends IWebSocketOptions {
        IncomingEnumType: EnumSerializationType;
        OutgoingEnumType: EnumSerializationType;
    }

    class DefaultJsonWebSocketOptions implements IJsonWebSocketOptions {
        IncomingEnumType: EnumSerializationType = "string";
        OutgoingEnumType: EnumSerializationType = "number";    
    }

    export abstract class JsonWebSocketTransport extends WebSocketTransport {
        protected incomingEnumType: EnumSerializationType;
        protected outgoingEnumType: EnumSerializationType;

        constructor(connectionString: WebSocketConnectionString, options?: IJsonWebSocketOptions) {
            super(connectionString, options);
            if (!options) options = new DefaultJsonWebSocketOptions();
            this.incomingEnumType = options.IncomingEnumType;
            this.outgoingEnumType = options.OutgoingEnumType;
        }



        protected abstract messageTypeToString(messageType: any, direction: MessageTypeDirection): string;

        public SendMessage(message: IMessage) {
            if (this.outgoingEnumType == "string") {
                message.MessageType = this.messageTypeToString(message.MessageType, "client");
            }
            super.SendMessage(message);
        }

        protected onMessageHandler(event: MessageEvent): void {
            if (typeof event.data === "string") {
                var message = JSON.parse(event.data) as BasicMessage;
                if (this.incomingEnumType == "string")
                    message.MessageType = this.messageTypeToString(message.MessageType, "server");
                if (this.debugMode) console.log(message);
                this.routeJsonMessage(message);
            } else if (event.data instanceof ArrayBuffer) {
                this.routeArrayBufferMessage(event.data);
            } else if (event.data instanceof Blob) {
                this.routeBlobMessage(event.data);
            }
        }

        protected abstract routeJsonMessage(message: IMessage): void;
        protected abstract routeArrayBufferMessage(arrayBuffer: ArrayBuffer): void;
        protected abstract routeBlobMessage(blob: Blob): void;
    }
}