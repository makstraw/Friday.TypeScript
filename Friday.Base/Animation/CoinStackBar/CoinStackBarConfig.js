var AtsLibAnimation;
(function (AtsLibAnimation) {
    var CoinStack;
    (function (CoinStack) {
        var CoinStackBarConfig = (function () {
            function CoinStackBarConfig() {
                this.CoinImgWidthPx = 1;
                this.CoinImgHeightPx = 1;
                this.CoinHeightPx = 1;
                this.MinValue = 0;
                this.MaxValue = 100;
                this.StartValue = 0;
                this.MaxStackHeightPcs = 10;
                this.XOffset = 0;
                this.YOffset = 0;
                this.CoinAnimXDrop = 0;
                this.CoinAnimYDrop = 300;
                this.CoinEffectDurationMs = 300;
                this.ShowShadow = true;
                this.Reseed = "always";
                this.Opacity = true;
            }
            return CoinStackBarConfig;
        }());
        CoinStack.CoinStackBarConfig = CoinStackBarConfig;
    })(CoinStack = AtsLibAnimation.CoinStack || (AtsLibAnimation.CoinStack = {}));
})(AtsLibAnimation || (AtsLibAnimation = {}));
//# sourceMappingURL=CoinStackBarConfig.js.map