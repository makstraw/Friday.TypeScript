///<reference path="JsonWebSocketTransport.ts"/>

namespace Friday.Transport {
    export abstract class ReflectionBasedTransport extends JsonWebSocketTransport{
        [key: string]: any;
        protected handlerNamePrefix: string = "doOn";

        private getHandlerName(messageType: any): string {
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
    }
}