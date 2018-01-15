///<reference path="WebSocketConnectionString.ts"/>
///<reference path="IMessage.ts"/>
///<reference path="IMessageSend.ts"/>
///<reference path="PingPong.ts"/>
namespace Friday.Transport {
    export type WebSocketBinaryType = "arraybuffer" | "blob";

    export interface IWebSocketOptions {
        binaryType?: WebSocketBinaryType;
        pingInstance?: PingPong;
    }

    export abstract class WebSocketTransport implements IMessageSend {
        private ping: PingPong;
        private  socket: WebSocket;
        private connectionString: WebSocketConnectionString;
        public debugMode: boolean = false;

        protected readonly autoReconnect : boolean = true;
        protected readonly autoReconnectTimeMs : number= 1000;
        protected autoReconnectTaskId : number;

        protected isReady: boolean = false;
        protected options: IWebSocketOptions;

        constructor(connectionString: WebSocketConnectionString, options?: IWebSocketOptions) {
            this.connectionString = connectionString;
            this.options = options;
            if (options) {
                if (typeof(options.pingInstance) != "undefined") this.ping = options.pingInstance;
            }
        }

        public connect(): void {
            this.socket = new WebSocket(this.connectionString.toString());
            if (this.options && typeof(this.options.binaryType) != "undefined") {
                this.socket.binaryType = this.options.binaryType;
            }
            
            this.socket.onclose = this.onCloseHandler.bind(this);;
            this.socket.onopen = this.onOpenHandler.bind(this);
            this.socket.onmessage = this.onMessageHandler.bind(this);
            this.socket.onerror = this.onErrorHandler.bind(this);;
        }

        public disconnect(): void {
            this.socket.close();
        }

        public sendMessage(message: IMessage): void {
            if (this.isReady)
                this.socket.send(JSON.stringify(message));
        }

        protected abstract onOpenHandler(): void;

        protected abstract onMessageHandler(event: MessageEvent): void;

        protected abstract onCloseHandler(event: CloseEvent): void;

        protected abstract onErrorHandler(): void;

        protected doOnPong(message: any) {
            if (typeof (this.ping) != "undefined") {
                this.ping.Pong();
                this.ping.CustomPongHandler(this.ping.GetRtt());
            }
        } 
    }
}