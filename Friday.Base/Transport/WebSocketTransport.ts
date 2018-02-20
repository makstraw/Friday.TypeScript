///<reference path="WebSocketConnectionString.ts"/>
///<reference path="IMessage.ts"/>
///<reference path="IMessageSend.ts"/>
namespace Friday.Transport {
    export type WebSocketBinaryType = "arraybuffer" | "blob";

    export interface IWebSocketOptions {
        BinaryType?: WebSocketBinaryType;
        AutoReconnect?: boolean;
        AutoReconnectTimeMs?: number;
        DebugMode?: boolean;
    }

    export abstract class WebSocketTransport implements IMessageSend {
        private  socket: WebSocket;
        private connectionString: WebSocketConnectionString;
        protected debugMode: boolean = false;

        protected manualDisconnect: boolean = false;
        protected readonly autoReconnect : boolean = false;
        protected readonly autoReconnectTimeMs : number = 1000;
        protected autoReconnectTaskId : number;

        protected options: IWebSocketOptions;

        constructor(connectionString: WebSocketConnectionString, options?: IWebSocketOptions) {
            this.connectionString = connectionString;
            this.options = options;
            if (options) {
                if (typeof options.DebugMode != "undefined") this.debugMode = options.DebugMode;
                if (typeof options.AutoReconnect != "undefined") this.autoReconnect = options.AutoReconnect;
                if (typeof options.AutoReconnectTimeMs != "undefined") this.autoReconnectTimeMs = options.AutoReconnectTimeMs;
            }
        }

        public Connect(): void {
            this.socket = new WebSocket(this.connectionString.toString());
            if (this.options && typeof(this.options.BinaryType) != "undefined") {
                this.socket.binaryType = this.options.BinaryType;
            }
            
            this.socket.onclose = this.onCloseHandler.bind(this);;
            this.socket.onopen = this.onOpenHandler.bind(this);
            this.socket.onmessage = this.onMessageHandler.bind(this);
            this.socket.onerror = this.onErrorHandler.bind(this);;
        }

        public Disconnect(): void {
            this.manualDisconnect = true;
            this.socket.close();
        }

        public SendMessage(message: IMessage): void {
            if(this.debugMode) console.log("Sending packet: ",message);
            if (this.socket.readyState == WebSocket.OPEN)
                this.socket.send(JSON.stringify(message));
            else if (this.debugMode) console.log("Not sent, socket is not ready");
        }

        protected onOpenHandler(): void {
            this.manualDisconnect = false;
        }

        protected abstract onMessageHandler(event: MessageEvent): void;

        protected onCloseHandler(event: CloseEvent): void {
            if (this.autoReconnect && ! this.manualDisconnect) {
                clearTimeout(this.autoReconnectTaskId);
                this.autoReconnectTaskId = setTimeout(this.Connect.bind(this), this.autoReconnectTimeMs);
            }
        }

        protected abstract onErrorHandler(event: ErrorEvent): void;
//
//        protected doOnPong(message: any) {
//            if (typeof (this.ping) != "undefined") {
//                this.ping.Pong();
//                this.ping.CustomPongHandler(this.ping.GetRtt());
//            }
//        } 
    }
}