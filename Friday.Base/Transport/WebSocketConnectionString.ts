namespace  AtsLibTransport {
    export class WebSocketConnectionString {
        private readonly server: string;
        private readonly port: number;
        private readonly path: string;
        private readonly secure: boolean;

        constructor(server: string, path: string,port: number = 80, secure: boolean = false) {
            this.server = server;
            this.port = port;
            this.path = path;
            this.secure = secure;


        }

        public toString() : string {
            let connectionString;
            if (this.secure) connectionString = "wss://";
            else connectionString = "ws://";

            connectionString += this.server;
            connectionString += ":"+this.port;
            connectionString += this.path;
            return connectionString;
        }
    }
}