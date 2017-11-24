///<reference path="WebSocketTransport.ts"/>
var AtsLibTransport;
(function (AtsLibTransport) {
    var PingPong = (function () {
        function PingPong(transport, pingMessage, customPongHandler) {
            this.transport = transport;
            this.pingMessage = pingMessage;
            this.CustomPongHandler = customPongHandler;
        }
        PingPong.prototype.Ping = function () {
            this.measureStart = Date.now();
            this.transport.sendMessage(this.pingMessage);
        };
        PingPong.prototype.Pong = function () {
            this.measureEnd = Date.now();
            this.rtt = (this.measureEnd - this.measureStart) / 2;
        };
        PingPong.prototype.GetRtt = function () {
            return this.rtt;
        };
        return PingPong;
    }());
    AtsLibTransport.PingPong = PingPong;
})(AtsLibTransport || (AtsLibTransport = {}));
//# sourceMappingURL=PingPong.js.map