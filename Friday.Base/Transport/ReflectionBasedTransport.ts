///<reference path="PingPong.ts"/>
///<reference path="WebSocketTransport.ts"/>

namespace AtsLibTransport {
    export abstract class ReflectionBasedTransport extends WebSocketTransport{
        [key: string]: any;
        protected handlerNamePrefix: string = "doOn";
        public ping: PingPong;

        protected onMessageHandler(event: MessageEvent): void {
            var message = JSON.parse(event.data);
            if (this.debugMode) console.log(message);
            var handlerName: string = this.handlerNamePrefix + message.MessageType;
            if (typeof this[handlerName] === "function") {
                var handler: Function = this[handlerName].bind(this);
                if (this.debugMode) console.log(handlerName);
                handler(message);
            } else {
                if(this.debugMode) console.log("Event not handled: " + handlerName);
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