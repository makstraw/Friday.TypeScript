var AtsLibKnockout;
(function (AtsLibKnockout) {
    var Counter = (function () {
        function Counter() {
            this.AnimationFrame = ko.observable("");
        }
        Counter.prototype.Start = function () {
            this.intervalHandle = setInterval(this.tick.bind(this), 1000);
        };
        Counter.prototype.Stop = function () {
            clearInterval(this.intervalHandle);
        };
        Counter.prototype.Reset = function () {
        };
        Counter.prototype.Set = function () {
        };
        Counter.prototype.animate = function () {
        };
        Counter.prototype.tick = function () {
        };
        return Counter;
    }());
    AtsLibKnockout.Counter = Counter;
})(AtsLibKnockout || (AtsLibKnockout = {}));
//# sourceMappingURL=Counter.js.map