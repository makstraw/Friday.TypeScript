namespace  Friday.Transport {
    export class WebSocketConnectionString {
        private readonly server: string;
        private readonly port: number;
        private readonly path: string;
        private readonly secure: boolean;

        constructor(server: string, path: string, port: number = 80, secure: boolean = false) {
            this.server = server;
            this.port = port;
            this.path = path;
            this.secure = secure;


        }

        public toString() : string {
            return `${this.secure ? "wss" : "ws"}://${this.server}:${this.port}${this.path}`;
        }

        public static ForPlainConnection(server: string, path: string, port: number = 80): WebSocketConnectionString {
            return new WebSocketConnectionString(server, path, port);
        }

        public static ForSecureSonnection(server: string, path: string, port: number = 443): WebSocketConnectionString {
            return new WebSocketConnectionString(server, path, port, true);
        }

        public static ForSameServer(path: string, port?: number): WebSocketConnectionString {
            let server = window.location.hostname;
            let secure = (window.location.protocol === 'https:');
            if (typeof port !== "number") secure ? port = 443 : port = 80;
            return new WebSocketConnectionString(server, path, port, secure);
        }
    }
}