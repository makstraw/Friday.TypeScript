///<reference path="PingPong.ts"/>
///<reference path="WebSocketTransport.ts"/>

namespace Friday.Transport {
    export type EnumSerializationType = "string" | "number";
    export type MessageTypeDirection = "peer" | "server" | "client";
    export abstract class ReflectionBasedTransport extends WebSocketTransport{
        [key: string]: any;
        protected handlerNamePrefix: string = "doOn";
        public ping: PingPong;
        private incomingEnumType: EnumSerializationType
        private outgoingEnumType: EnumSerializationType

        constructor(connectionString: WebSocketConnectionString, incomingEnumType: EnumSerializationType = "string", outgoingEnumType: EnumSerializationType = "number") {
            super(connectionString);
            this.incomingEnumType = incomingEnumType;
            this.outgoingEnumType = outgoingEnumType;
        }

        protected abstract messageTypeToString(messageType: any, direction: MessageTypeDirection): string;

        public sendMessage(message: IMessage) {
            if (this.outgoingEnumType == "string") {
                message.MessageType = this.messageTypeToString(message.MessageType, "client");
            }
            super.sendMessage(message);
        }

        private getHandlerName(messageType: any) : string {
            let handlerName: string = this.handlerNamePrefix;
            if (this.incomingEnumType == "number") handlerName += this.messageTypeToString(messageType, "server");
            else handlerName += messageType;
            return handlerName;
        }

        protected routeJsonMessage(message: IMessage) {
            var handlerName: string = this.getHandlerName(message.MessageType);
            if (typeof this[handlerName] === "function") {
                var handler: Function = this[handlerName].bind(this);
                if (this.debugMode) console.log(handlerName);
                handler(message);
            } else {
                if (this.debugMode) console.log("Event not handled: " + handlerName);
            }
        }

        protected abstract routeArrayBufferMessage(arrayBuffer: ArrayBuffer) : void;

        protected onMessageHandler(event: MessageEvent): void {
            if (typeof event.data === "string") {
                var message = JSON.parse(event.data);
                if (this.debugMode) console.log(message);
                this.routeJsonMessage(message);
            } else if (event.data instanceof ArrayBuffer) {
                this.routeArrayBufferMessage(event.data);
            } else if (event.data instanceof Blob) {
            }
        }

        protected doOnPong(message: any) {
            if (typeof (this.ping) != "undefined") {
                this.ping.Pong();
                this.ping.CustomPongHandler(this.ping.GetRtt());
            }
        } 
    }
}