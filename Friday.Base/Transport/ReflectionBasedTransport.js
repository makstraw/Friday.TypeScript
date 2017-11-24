///<reference path="PingPong.ts"/>
///<reference path="WebSocketTransport.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AtsLibTransport;
(function (AtsLibTransport) {
    var ReflectionBasedTransport = (function (_super) {
        __extends(ReflectionBasedTransport, _super);
        function ReflectionBasedTransport() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.handlerNamePrefix = "doOn";
            return _this;
        }
        ReflectionBasedTransport.prototype.onMessageHandler = function (event) {
            var message = JSON.parse(event.data);
            if (this.debugMode)
                console.log(message);
            var handlerName = this.handlerNamePrefix + message.MessageType;
            if (typeof this[handlerName] === "function") {
                var handler = this[handlerName].bind(this);
                if (this.debugMode)
                    console.log(handlerName);
                handler(message);
            }
            else {
                if (this.debugMode)
                    console.log("Event not handled: " + handlerName);
            }
        };
        ReflectionBasedTransport.prototype.doOnPong = function (message) {
            if (typeof (this.ping) != "undefined") {
                this.ping.Pong();
                this.ping.CustomPongHandler(this.ping.GetRtt());
            }
        };
        return ReflectionBasedTransport;
    }(AtsLibTransport.WebSocketTransport));
    AtsLibTransport.ReflectionBasedTransport = ReflectionBasedTransport;
})(AtsLibTransport || (AtsLibTransport = {}));
//# sourceMappingURL=ReflectionBasedTransport.js.map