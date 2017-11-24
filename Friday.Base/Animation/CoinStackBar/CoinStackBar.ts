///<reference path="types.ts"/>
///<reference path="CoinStackShadow.ts"/>
///<reference path="Coin.ts"/>
///<reference path="CoinStackBarConfig.ts"/>
namespace AtsLibAnimation.CoinStack {

    export class CoinStackPile {
        constructor() {
            
        }
    }

    export class CoinStackBar {
        private readonly container: HTMLElement;
        private shadow: CoinStackShadow;
        private containerHeight: number;
        private containerWidth: number;
        private stackSize: number;
        private currentValue: number;
        private seed: number;

        private readonly cfg: CoinStackBarConfig;
        private coins: Array<Coin> = [];

        public RequestAnimFrame: Function = (callback: Function) => window.requestAnimationFrame || window.webkitRequestAnimationFrame;

        constructor(cfg: CoinStackBarConfig) {
            this.cfg = cfg;
            this.container = cfg.Container;
            this.seed = cfg.Seed || Math.random();
            this.stackSize = this.setDimensions(cfg.ContainerWidthPx, cfg.ContainerHeightPx);
            this.setupContainer();
            this.SetValue(cfg.StartValue);
            this.Update();
        }

        private setupContainer() {
            this.container.style.position = "relative";

            this.containerHeight = ((this.cfg.CoinImgHeightPx + this.cfg.MaxStackHeightPcs * this.cfg.CoinHeightPx) * this.stackSize);
            this.containerWidth = (this.cfg.CoinImgWidthPx + 2 * this.cfg.XOffset) * this.stackSize;
            this.container.style.height = this.containerHeight + "px";
            this.container.style.width = this.containerWidth + "px";
            this.shadow = new CoinStackShadow(this.stackSize,
                this.cfg.CoinImgHeightPx,
                this.cfg.CoinImgWidthPx,
                this.containerHeight);
            this.shadow.Attach(this.container);


        }

        public Clear() {
//            var coins = this.container.getElementsByTagName("img");
//            for (var i = 0; i < coins.length; i++) {
//                coins[i].
//            }
            for (var i = 0; i < this.coins.length; i++) {
                this.coins[i].Detach(this.container);
            }
            this.coins = [];
        }

        public Update() {
            //Do nothing if no coins visible.
            if (this.coins) {
                //Update all coins
                this.coins.forEach(function (this: CoinStackBar, coin, key) {
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
                    },
                    this);
            }
            window.requestAnimationFrame(() => { this.Update(); });
//            this.RequestAnimFrame(() => {
//                this.Update();
//            });
        }

        private setDimensions(width?: number, height?: number) : number {
            var picksmaller = '';
            //Precalculate dimensions depending on the containerwidth and containerheight set.
            var widthsize = width / this.cfg.CoinImgWidthPx;
            var heightsize = height / (this.cfg.CoinImgHeightPx + this.cfg.MaxStackHeightPcs * this.cfg.CoinHeightPx);
            //If both parameters are set, choose the one that creates the smaller resulting stack.
            if (typeof (width) != 'undefined' && typeof (height) != 'undefined') {
                if (widthsize < heightsize) {
                    picksmaller = 'width';
                } else {
                    picksmaller = 'height';
                }
            }
            //Otherwise, choose the one that is set.
            if ((typeof (width) == 'undefined' && typeof(height) != 'undefined') || picksmaller == 'height') {
                return heightsize;
            } else if ((typeof (height) == 'undefined' && typeof (width) != 'undefined') || picksmaller == 'width') {
                return widthsize;
            } else {
                //Otherwise, create stack at full scale.
                return 1;
            }
        }

        private rand(val: number, seed: number) {
            return Math.cos(val * Math.cos(val * seed));
        }

        private updateMinMax(newMinValue?: number, newMaxValue?: number) {
            if (typeof (newMinValue) != 'undefined') {
                this.cfg.MinValue = newMinValue;
            }
            if (typeof (newMaxValue) != 'undefined') {
                this.cfg.MaxValue = newMaxValue;
            }
        }

        private removeCoin(i: number) {
            if (this.coins[i]) {
                this.coins[i].Detach(this.container);
                this.coins.splice(i, 1);
            }
        }

        private fadeOutCoin(i: number, durationoffset: number) {
            //Only fade out if not already fading out.
            if (this.coins[i] && this.coins[i].Status != 'fadeout') {
                this.coins[i].StartTime = Date.now() + (durationoffset * this.coins[i].Durartion * 0.3);
                this.coins[i].Status = 'fadeout';
            }
        }

        private createNewCoin(i: number, durationoffset: number) {
            var coinElement = new Coin(this.cfg.CoinImgSrc,
                this.cfg.CoinImgWidthPx * this.stackSize,
                this.cfg.CoinImgHeightPx * this.stackSize,
                this.cfg.Opacity);

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

            //Add the coin to the array so we can change and remove it again later.
            this.coins.push(coinElement);
        }

        public SetValue(newValue: number, newMinValue?: number, newMaxValue?: number) : boolean {
            //If set, update minimum and maximum values.
            if (typeof (newMinValue) != 'undefined' || typeof (newMaxValue) != 'undefined') {
                this.updateMinMax(newMinValue, newMaxValue);
            }


            //Ensure that the value is between the minimum and the maximum of the CoinStackBar.
            var clamped = Math.min(Math.max(newValue, this.cfg.MinValue), this.cfg.MaxValue);


            if (clamped == this.currentValue) {//Do nothing if there's no change in value
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
            } else if (coins < oldcoins) {
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
        }

    }
}