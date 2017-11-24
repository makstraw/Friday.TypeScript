///<reference path="WebSocketConnectionString.ts"/>
///<reference path="IMessage.ts"/>
namespace AtsLibTransport {
    export abstract class WebSocketTransport {
        
        private  socket: WebSocket;
        private connectionString: WebSocketConnectionString;
        public debugMode: boolean = false;

        protected readonly autoReconnect : boolean = true;
        protected readonly autoReconnectTimeMs : number= 1000;
        protected autoReconnectTaskId : number;

        protected isReady: boolean = false;

        constructor(connectionString: WebSocketConnectionString) {
            this.connectionString = connectionString;
            this.connect();
        }

        public connect(): void {
            this.socket = new WebSocket(this.connectionString.toString());

            this.socket.onclose = this.onCloseHandler.bind(this);;
            this.socket.onopen = this.onOpenHandler.bind(this);
            this.socket.onmessage = this.onMessageHandler.bind(this);
            this.socket.onerror = this.onErrorHandler.bind(this);;
        }

        public disconnect(): void {
            this.socket.close();
        }

        public sendMessage(message: IMessage): void {
//            this.socket.send(JSON.stringify(message));
            if (this.isReady)
                this.socket.send(JSON.stringify(message));
//            else (setTimeout(this.sendMessage, 500, message));
        }

        protected abstract onOpenHandler(): void;

        protected abstract onMessageHandler(event: MessageEvent): void;

        protected abstract onCloseHandler(event: CloseEvent): void;

        protected abstract onErrorHandler(): void;



    }
}