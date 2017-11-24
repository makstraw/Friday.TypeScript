///<reference path="WebSocketConnectionString.ts"/>
///<reference path="IMessage.ts"/>
var AtsLibTransport;
(function (AtsLibTransport) {
    var WebSocketTransport = (function () {
        function WebSocketTransport(connectionString) {
            this.debugMode = false;
            this.autoReconnect = true;
            this.autoReconnectTimeMs = 1000;
            this.isReady = false;
            this.connectionString = connectionString;
            this.connect();
        }
        WebSocketTransport.prototype.connect = function () {
            this.socket = new WebSocket(this.connectionString.toString());
            this.socket.onclose = this.onCloseHandler.bind(this);
            ;
            this.socket.onopen = this.onOpenHandler.bind(this);
            this.socket.onmessage = this.onMessageHandler.bind(this);
            this.socket.onerror = this.onErrorHandler.bind(this);
            ;
        };
        WebSocketTransport.prototype.disconnect = function () {
            this.socket.close();
        };
        WebSocketTransport.prototype.sendMessage = function (message) {
            //            this.socket.send(JSON.stringify(message));
            if (this.isReady)
                this.socket.send(JSON.stringify(message));
            //            else (setTimeout(this.sendMessage, 500, message));
        };
        return WebSocketTransport;
    }());
    AtsLibTransport.WebSocketTransport = WebSocketTransport;
})(AtsLibTransport || (AtsLibTransport = {}));
//# sourceMappingURL=WebSocketTransport.js.map