///<reference path="WebSocketTransport.ts"/>
namespace Friday.Transport {
    export class PingPong {
        private rtt: number;
        private measureStart: number;
        private measureEnd: number;
        private transport: WebSocketTransport;
        private pingMessage: IMessage;
        public CustomPongHandler: Function;

        constructor(transport: WebSocketTransport, pingMessage: IMessage, customPongHandler: Function) {
            this.transport = transport;
            this.pingMessage = pingMessage;
            this.CustomPongHandler = customPongHandler;
        }

        public Ping() {
            this.measureStart = Date.now();
            this.transport.sendMessage(this.pingMessage);
        }

        public Pong() {
            this.measureEnd = Date.now();
            this.rtt = (this.measureEnd - this.measureStart) / 2;
        }

        public GetRtt(): number {
            return this.rtt;
        }

    }
}