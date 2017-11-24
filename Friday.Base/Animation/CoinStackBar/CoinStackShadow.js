var AtsLibAnimation;
(function (AtsLibAnimation) {
    var CoinStack;
    (function (CoinStack) {
        var CoinStackShadow = (function () {
            function CoinStackShadow(stacksize, coinImgHeight, coinImgWidth, containerHeight) {
                this.width = coinImgWidth * stacksize * 2;
                this.container = document.createElement('div');
                this.container.style.position = 'relative';
                this.container.style.width = this.width + 'px';
                this.container.style.height = coinImgHeight * stacksize * 2 + 'px';
                this.container.style.top = containerHeight - (coinImgHeight * stacksize * 1.5) + 'px';
                this.container.style.left = this.width / 4 + 'px';
                this.container.style.opacity = '0';
                this.container.style.background = '-webkit-radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
                this.container.style.background = 'radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
            }
            CoinStackShadow.prototype.Attach = function (parent) {
                parent.appendChild(this.container);
            };
            CoinStackShadow.prototype.UpdateOpactity = function (value) {
                this.container.style.opacity = value.toString();
            };
            return CoinStackShadow;
        }());
        CoinStack.CoinStackShadow = CoinStackShadow;
    })(CoinStack = AtsLibAnimation.CoinStack || (AtsLibAnimation.CoinStack = {}));
})(AtsLibAnimation || (AtsLibAnimation = {}));
//# sourceMappingURL=CoinStackShadow.js.map