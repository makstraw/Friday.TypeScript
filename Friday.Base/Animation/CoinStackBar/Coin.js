var AtsLibAnimation;
(function (AtsLibAnimation) {
    var CoinStack;
    (function (CoinStack) {
        var Coin = (function () {
            function Coin(imageSource, width, height, opacity) {
                this.Status = 'fadein';
                //Creates image element with the correct source.
                this.container = document.createElement('img');
                this.container.src = imageSource;
                this.opacity = opacity;
                this.container.style.position = "absolute";
                this.container.style.width = width + "px";
                this.container.style.height = height + "px";
                if (this.opacity)
                    this.container.style.opacity = '0'; //Default to 0 to avoid rendering glitches on slower PC's
            }
            Coin.prototype.FadeIn = function (frame, stackSize) {
                this.container.style.bottom = this.YPosition + (this.YDrop * (1.0 - frame) * stackSize) + "px";
                this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
                if (this.opacity)
                    this.container.style.opacity = frame.toString();
            };
            Coin.prototype.FadeOut = function (frame, stackSize) {
                this.container.style.bottom = this.YPosition + (this.YDrop * (frame) * stackSize) + "px";
                this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
                if (this.opacity)
                    this.container.style.opacity = (1.0 - frame).toString(); //TODO?
            };
            Coin.prototype.GetOpactiy = function () {
                if (!this.opacity)
                    return 1;
                return parseFloat(this.container.style.opacity);
            };
            Coin.prototype.UpdateOpactity = function (value) {
                if (this.opacity)
                    this.container.style.opacity = value.toString();
            };
            Coin.prototype.Attach = function (parent) {
                parent.appendChild(this.container);
            };
            Coin.prototype.Detach = function (parent) {
                parent.removeChild(this.container);
            };
            return Coin;
        }());
        CoinStack.Coin = Coin;
    })(CoinStack = AtsLibAnimation.CoinStack || (AtsLibAnimation.CoinStack = {}));
})(AtsLibAnimation || (AtsLibAnimation = {}));
//# sourceMappingURL=Coin.js.map