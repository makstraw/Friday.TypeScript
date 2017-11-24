var AtsLibTransport;
(function (AtsLibTransport) {
    var WebSocketConnectionString = (function () {
        function WebSocketConnectionString(server, path, port, secure) {
            if (port === void 0) { port = 80; }
            if (secure === void 0) { secure = false; }
            this.server = server;
            this.port = port;
            this.path = path;
            this.secure = secure;
        }
        WebSocketConnectionString.prototype.toString = function () {
            var connectionString;
            if (this.secure)
                connectionString = "wss://";
            else
                connectionString = "ws://";
            connectionString += this.server;
            connectionString += ":" + this.port;
            connectionString += this.path;
            return connectionString;
        };
        return WebSocketConnectionString;
    }());
    AtsLibTransport.WebSocketConnectionString = WebSocketConnectionString;
})(AtsLibTransport || (AtsLibTransport = {}));
//# sourceMappingURL=WebSocketConnectionString.js.map