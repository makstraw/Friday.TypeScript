var AtsLibAnimation;
(function (AtsLibAnimation) {
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
        }
        return CoinStackBarConfig;
    }());
    AtsLibAnimation.CoinStackBarConfig = CoinStackBarConfig;
    var Coin = (function () {
        function Coin(imageSource, width, height) {
            this.Status = 'fadein';
            //Creates image element with the correct source.
            this.container = document.createElement('img');
            this.container.src = imageSource;
            this.container.style.position = "absolute";
            this.container.style.width = width + "px";
            this.container.style.height = height + "px";
            this.container.style.opacity = '0'; //Default to 0 to avoid rendering glitches on slower PC's
        }
        Coin.prototype.FadeIn = function (frame, stackSize) {
            this.container.style.bottom = this.YPosition + (this.YDrop * (1.0 - frame) * stackSize) + "px";
            this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
            this.container.style.opacity = frame.toString();
        };
        Coin.prototype.FadeOut = function (frame, stackSize) {
            this.container.style.bottom = this.YPosition + (this.YDrop * (frame) * stackSize) + "px";
            this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
            this.container.style.opacity = (1.0 - frame).toString(); //TODO?
        };
        Coin.prototype.GetOpactiy = function () {
            return parseFloat(this.container.style.opacity);
        };
        Coin.prototype.UpdateOpactity = function (value) {
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
    var CoinStackBar = (function () {
        function CoinStackBar(cfg) {
            this.coins = [];
            this.RequestAnimFrame = function (callback) { return window.requestAnimationFrame || window.webkitRequestAnimationFrame; };
            this.cfg = cfg;
            this.container = cfg.Container;
            this.seed = cfg.Seed || Math.random();
            this.stackSize = this.setDimensions(cfg.ContainerWidthPx, cfg.ContainerHeightPx);
            this.setupContainer();
            this.SetValue(cfg.StartValue);
            this.Update();
        }
        CoinStackBar.prototype.setupContainer = function () {
            this.container.style.position = "relative";
            this.containerHeight = ((this.cfg.CoinImgHeightPx + this.cfg.MaxStackHeightPcs * this.cfg.CoinHeightPx) * this.stackSize);
            this.containerWidth = (this.cfg.CoinImgWidthPx + 2 * this.cfg.XOffset) * this.stackSize;
            this.container.style.height = this.containerHeight + "px";
            this.container.style.width = this.containerWidth + "px";
            this.shadow = new CoinStackShadow(this.stackSize, this.cfg.CoinImgHeightPx, this.cfg.CoinImgWidthPx, this.containerHeight);
            this.shadow.Attach(this.container);
        };
        CoinStackBar.prototype.Update = function () {
            var _this = this;
            //Do nothing if no coins visible.
            if (this.coins) {
                //Update all coins
                this.coins.forEach(function (coin, key) {
                    //animframe = fraction (0.0-1.0) of time between start and start+duration.
                    var animframe = 1.0 - ((coin.StartTime + coin.Durartion) - Date.now()) / coin.Durartion;
                    animframe = Math.max(Math.min(1, animframe), 0);
                    //Fade coin in.
                    if (coin.Status == 'fadein') {
                        coin.FadeIn(animframe, this.stackSize);
                        if (animframe >= 1) {
                            coin.Status = 'idle';
                        }
                    }
                    //Fade coin out -> essentially the same as fading in but backwards.
                    if (coin.Status == 'fadeout') {
                        coin.FadeOut(animframe, this.stackSize);
                        if (animframe >= 1) {
                            this.removeCoin(key);
                        }
                        //If coins below me are still fading in while I am fading out, lower my opacity, to prevent graphical glitches (e.g. floating coins).
                        if (this.coins[key - 1]) {
                            coin.UpdateOpactity(Math.min(coin.GetOpactiy(), this.coins[key - 1].GetOpactiy()));
                        }
                    }
                }, this);
            }
            window.requestAnimationFrame(function () { _this.Update(); });
            //            this.RequestAnimFrame(() => {
            //                this.Update();
            //            });
        };
        CoinStackBar.prototype.setDimensions = function (width, height) {
            var picksmaller = '';
            //Precalculate dimensions depending on the containerwidth and containerheight set.
            var widthsize = width / this.cfg.CoinImgWidthPx;
            var heightsize = height / (this.cfg.CoinImgHeightPx + this.cfg.MaxStackHeightPcs * this.cfg.CoinHeightPx);
            //If both parameters are set, choose the one that creates the smaller resulting stack.
            if (typeof (width) != 'undefined' && typeof (height) != 'undefined') {
                if (widthsize < heightsize) {
                    picksmaller = 'width';
                }
                else {
                    picksmaller = 'height';
                }
            }
            //Otherwise, choose the one that is set.
            if ((typeof (width) == 'undefined' && typeof (height) != 'undefined') || picksmaller == 'height') {
                return heightsize;
            }
            else if ((typeof (height) == 'undefined' && typeof (width) != 'undefined') || picksmaller == 'width') {
                return widthsize;
            }
            else {
                //Otherwise, create stack at full scale.
                return 1;
            }
        };
        CoinStackBar.prototype.rand = function (val, seed) {
            return Math.cos(val * Math.cos(val * seed));
        };
        CoinStackBar.prototype.updateMinMax = function (newMinValue, newMaxValue) {
            if (typeof (newMinValue) != 'undefined') {
                this.cfg.MinValue = newMinValue;
            }
            if (typeof (newMaxValue) != 'undefined') {
                this.cfg.MaxValue = newMaxValue;
            }
        };
        CoinStackBar.prototype.removeCoin = function (i) {
            if (this.coins[i]) {
                this.coins[i].Detach(this.container);
                this.coins.splice(i, 1);
            }
        };
        CoinStackBar.prototype.fadeOutCoin = function (i, durationoffset) {
            //Only fade out if not already fading out.
            if (this.coins[i] && this.coins[i].Status != 'fadeout') {
                this.coins[i].StartTime = Date.now() + (durationoffset * this.coins[i].Durartion * 0.3);
                this.coins[i].Status = 'fadeout';
            }
        };
        CoinStackBar.prototype.createNewCoin = function (i, durationoffset) {
            var coinElement = new Coin(this.cfg.CoinImgSrc, this.cfg.CoinImgWidthPx * this.stackSize, this.cfg.CoinImgHeightPx * this.stackSize);
            //            //If array, pick an image at random.
            //            if (Object.prototype.toString.call(this.coinimgsrc) === '[object Array]') {
            //                var index = Math.floor(Math.abs(this.rand(i + 1, this.seed) * this.coinimgsrc.length));
            //                coinelem.src = this.coinimgsrc[index];
            //            } else {
            //                coinelem.src = this.coinimgsrc;
            //            }
            //Sets the x and y position of the coin. A pseudo-random value is used so we can restack the stack exactly the same each time, if we want to.
            coinElement.XPosition = +this.rand(i, this.seed) * (this.cfg.XOffset * this.stackSize);
            coinElement.YPosition = i * (this.cfg.CoinHeightPx * this.stackSize) + this.rand(i, this.seed) * (this.cfg.YOffset * this.stackSize);
            coinElement.XDrop = this.cfg.CoinAnimXDrop;
            coinElement.YDrop = this.cfg.CoinAnimYDrop;
            coinElement.Attach(this.container);
            coinElement.Durartion = this.cfg.CoinEffectDurationMs;
            //Time at which the coin should fade in. If there's more than one coin, ensure that the time is later than that of the coin below to make the effect look more natural.
            coinElement.StartTime = Date.now();
            if (this.coins.length > 0) {
                coinElement.StartTime = Math.max(this.coins[this.coins.length - 1].StartTime + this.cfg.CoinEffectDurationMs * 0.3, coinElement.StartTime);
            }
            else { }
            //Add the coin to the array so we can change and remove it again later.
            this.coins.push(coinElement);
        };
        CoinStackBar.prototype.SetValue = function (newValue, newMinValue, newMaxValue) {
            //If set, update minimum and maximum values.
            if (typeof (newMinValue) != 'undefined' || typeof (newMaxValue) != 'undefined') {
                this.updateMinMax(newMinValue, newMaxValue);
            }
            //Ensure that the value is between the minimum and the maximum of the CoinStackBar.
            var clamped = Math.min(Math.max(newValue, this.cfg.MinValue), this.cfg.MaxValue);
            if (clamped == this.currentValue) {
                return false;
            }
            //Otherwise: Calculate the amount of coins to show for the current value. 
            var coins = Math.round((clamped / this.cfg.MaxValue) * this.cfg.MaxStackHeightPcs);
            //Also calculate the amount of coins that were already in the stack.
            var oldcoins = Math.round((this.currentValue / this.cfg.MaxValue) * this.cfg.MaxStackHeightPcs);
            //If we want to reseed, change the seed.
            if (this.cfg.Reseed == 'always' || (coins == 0 && oldcoins != 0 && this.cfg.Reseed == "onzero")) {
                this.seed = this.rand(this.seed, this.seed + 1);
            }
            //If there are more coins than before, add new ones until at the new height.
            if (coins > oldcoins) {
                for (var i = oldcoins; i < coins; i++) {
                    this.createNewCoin(i, i - oldcoins);
                }
                //If there are less, remove coins (fade them out) until at new height.
            }
            else if (coins < oldcoins) {
                for (var i = oldcoins; i >= coins; i--) {
                    this.fadeOutCoin(i, oldcoins - i);
                }
            }
            //Update the shadow's opacity to the amount of coins compared to the maximum height.
            if (this.cfg.ShowShadow) {
                this.shadow.UpdateOpactity(coins / this.cfg.MaxStackHeightPcs);
            }
            //Store the value to be used next time this function is called.
            this.currentValue = clamped;
            return true;
        };
        return CoinStackBar;
    }());
    AtsLibAnimation.CoinStackBar = CoinStackBar;
})(AtsLibAnimation || (AtsLibAnimation = {}));
//# sourceMappingURL=CoinStackBar.js.map