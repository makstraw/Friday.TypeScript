var BitcoinLib;
(function (BitcoinLib) {
    var BitcoinMultiplier = (function () {
        function BitcoinMultiplier(name, power) {
            this.Name = ko.observable(name);
            this.Power = ko.observable(power);
        }
        BitcoinMultiplier.prototype.toString = function () {
            return "" + this.Name();
        };
        return BitcoinMultiplier;
    }());
    BitcoinLib.BitcoinMultiplier = BitcoinMultiplier;
    var FiatCurrency = (function () {
        function FiatCurrency(name, sign, rate) {
            this.Name = ko.observable(name);
            this.Sign = ko.observable(sign);
            this.Rate = ko.observable(rate);
        }
        FiatCurrency.prototype.toString = function () {
            return this.Name() + "(" + this.Sign() + ")";
        };
        return FiatCurrency;
    }());
    BitcoinLib.FiatCurrency = FiatCurrency;
    var Bitcoin = (function () {
        function Bitcoin(satoshiAmount) {
            var _this = this;
            this.satoshiAmount = ko.observable(0);
            this.Step = ko.pureComputed(function () { return 1 / Bitcoin.getMultiplier(Bitcoin.DefaultMultiplier().Name()); });
            this.Power = ko.pureComputed(function () { return Bitcoin.DefaultMultiplier().Power(); });
            this.Units = ko.pureComputed(this.displayUnits, this);
            this.Display = ko.pureComputed(this.toDefaultType, this);
            this.Fiat = ko.pureComputed(this.toFiat, this);
            this.FiatName = ko.pureComputed(function () { return Bitcoin.FiatRates().Name(); });
            this.FiatSign = ko.pureComputed(function () { return Bitcoin.FiatRates().Sign(); });
            this.BtcFiatDisplay = ko.pureComputed(function () {
                return _this.FiatSign() + _this.toFiat().toFixed(2) + " / " + _this.toDefaultType() + " " + _this.displayUnits();
            }, this);
            this.Input = ko.computed({
                read: this.toDefaultType,
                write: this.fromDefaultType,
                owner: this
            });
            this.satoshiAmount(parseInt(satoshiAmount.toFixed(0)));
        }
        Bitcoin.FromSatoshi = function (satoshi) {
            if (isNaN(satoshi))
                satoshi = 0;
            return new Bitcoin(satoshi);
        };
        Bitcoin.FromMilliBtc = function (mBtc) {
            return new Bitcoin(mBtc * Bitcoin.getMultiplier(Bitcoin.mBTC));
        };
        Bitcoin.FromBits = function (bits) {
            return new Bitcoin(bits * Bitcoin.getMultiplier(Bitcoin.Bits));
        };
        Bitcoin.FromBtc = function (btc) {
            return new Bitcoin(btc * Bitcoin.getMultiplier(Bitcoin.BTC));
        };
        Bitcoin.Fee = function (percent, amount, min, max) {
            var fee = new Bitcoin(amount.ToSatoshi() * percent / 100);
            if (typeof (min) != "undefined" && fee.LessThan(min))
                return Bitcoin.Clone(min);
            if (typeof (max) != "undefined" && fee.MoreThan(max))
                return Bitcoin.Clone(max);
            return fee;
        };
        Bitcoin.Clone = function (instance) {
            return Bitcoin.FromSatoshi(instance.ToSatoshi());
        };
        Bitcoin.prototype.ToSatoshi = function () {
            return this.satoshiAmount();
        };
        Bitcoin.prototype.ToBits = function () {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.Bits);
        };
        Bitcoin.prototype.ToBtc = function () {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.BTC);
        };
        Bitcoin.prototype.ToMilliBtc = function () {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.mBTC);
        };
        Bitcoin.getMultiplier = function (multiplier) {
            var power = 0;
            for (var i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name() == multiplier) {
                    power = Bitcoin.BitcoinFormatList()[i].Power();
                    break;
                }
            }
            return Math.pow(10, power);
        };
        Bitcoin.trimZeroes = function (value, power) {
            return parseFloat(value.toFixed(power));
        };
        Bitcoin.calculate = function (value, multiplier) {
            return value * Bitcoin.getMultiplier(multiplier);
        };
        Bitcoin.prototype.LessThan = function (value) {
            return this.satoshiAmount() < value.satoshiAmount();
        };
        Bitcoin.prototype.MoreThan = function (value) {
            return this.satoshiAmount() > value.satoshiAmount();
        };
        Bitcoin.prototype.Equal = function (value) {
            return this.satoshiAmount() == value.satoshiAmount();
        };
        Bitcoin.prototype.MoreOrEqualThan = function (value) {
            return (this.MoreThan(value) || this.Equal(value));
        };
        Bitcoin.prototype.LessOrEqualThan = function (value) {
            return (this.LessThan(value) || this.Equal(value));
        };
        Bitcoin.prototype.Add = function (value) {
            this.satoshiAmount(this.ToSatoshi() + value.ToSatoshi());
        };
        Bitcoin.prototype.Sub = function (value) {
            this.satoshiAmount(this.ToSatoshi() - value.ToSatoshi());
        };
        Bitcoin.prototype.Set = function (value, forceNotify) {
            if (forceNotify === void 0) { forceNotify = false; }
            this.satoshiAmount(value.ToSatoshi());
            if (forceNotify)
                this.satoshiAmount.notifySubscribers(this.satoshiAmount());
        };
        Bitcoin.prototype.toFiat = function () {
            var value = this.ToBtc() * Bitcoin.FiatRates().Rate();
            if (value.toString() == "NaN")
                return 0;
            else
                return value;
        };
        Bitcoin.prototype.displayUnits = function () {
            var computedValue;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case Bitcoin.Satoshi:
                    computedValue = "Sat.";
                    break;
                case Bitcoin.Bits:
                    computedValue = "Bits";
                    break;
                case Bitcoin.mBTC:
                    computedValue = "mBTC";
                    break;
                case Bitcoin.BTC:
                    computedValue = "BTC";
                    break;
                default:
                    computedValue = "Sat.";
            }
            return computedValue;
        };
        Bitcoin.prototype.fromDefaultType = function (value) {
            var parsedValue = parseFloat(value);
            var computedValue;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case Bitcoin.Satoshi:
                    computedValue = Bitcoin.FromSatoshi(parsedValue).ToSatoshi();
                    break;
                case Bitcoin.Bits:
                    computedValue = Bitcoin.FromBits(parsedValue).ToSatoshi();
                    break;
                case Bitcoin.mBTC:
                    computedValue = Bitcoin.FromMilliBtc(parsedValue).ToSatoshi();
                    break;
                case Bitcoin.BTC:
                    computedValue = Bitcoin.FromBtc(parsedValue).ToSatoshi();
                    break;
                default:
                    computedValue = Bitcoin.FromSatoshi(parsedValue).ToSatoshi();
            }
            this.satoshiAmount(computedValue);
        };
        Bitcoin.prototype.toDefaultType = function (trailingZeroes) {
            if (trailingZeroes === void 0) { trailingZeroes = false; }
            var returnValue;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case Bitcoin.Satoshi:
                    returnValue = this.ToSatoshi();
                    break;
                case Bitcoin.Bits:
                    returnValue = this.ToBits();
                    break;
                case Bitcoin.mBTC:
                    returnValue = this.ToMilliBtc();
                    break;
                case Bitcoin.BTC:
                    returnValue = this.ToBtc();
                    break;
                default:
                    returnValue = this.ToSatoshi();
            }
            //            console.log(`Pow: ${this.Power()}:${returnValue}`);
            //            console.log(returnValue.toFixed(this.Power()));
            //console.log(this.trimTrailingZeroes(returnValue.toFixed(this.Power())));
            if (trailingZeroes) {
                return returnValue.toString();
            }
            else {
                if (Bitcoin.DefaultMultiplier().Name() == Bitcoin.Satoshi)
                    return returnValue.toString();
                return this.trimTrailingZeroes(returnValue.toFixed(this.Power()));
            }
        };
        Bitcoin.prototype.trimDot = function (value) {
            if (value[value.length - 1] == ".")
                return value.slice(0, value.length - 1);
            return value;
        };
        Bitcoin.prototype.trimTrailingZeroes = function (value) {
            for (var i = value.length - 1; i >= 1; i--) {
                //                console.log(`i: ${i} value: ${value} char: ${value.charAt(i)}`);
                if (value.charAt(i) != "0") {
                    //                    console.log(`trig`);
                    return this.trimDot(value.slice(0, i + 1));
                }
            }
            return value;
        };
        // ReSharper disable once InconsistentNaming
        Bitcoin.prototype.valueOf = function () {
            return this.satoshiAmount();
        };
        // ReSharper disable once InconsistentNaming
        Bitcoin.prototype.toString = function () {
            return this.satoshiAmount.toString();
        };
        Bitcoin.SetFormat = function (formatName) {
            for (var i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name().toLowerCase() == formatName.toLowerCase()) {
                    Bitcoin.DefaultMultiplier(Bitcoin.BitcoinFormatList()[i]);
                }
            }
        };
        Bitcoin.Bits = "Bits";
        Bitcoin.BTC = "BTC";
        Bitcoin.mBTC = "mBTC";
        Bitcoin.Satoshi = "Satoshi";
        Bitcoin.BitcoinFormatList = ko.observableArray([
            new BitcoinMultiplier(Bitcoin.Satoshi, 0),
            new BitcoinMultiplier(Bitcoin.Bits, 2),
            new BitcoinMultiplier(Bitcoin.mBTC, 5),
            new BitcoinMultiplier(Bitcoin.BTC, 8)
        ]);
        Bitcoin.FiatRates = ko.observable(new FiatCurrency("USD", "$", 1));
        Bitcoin.DefaultMultiplier = ko.observable(Bitcoin.BitcoinFormatList()[0]);
        return Bitcoin;
    }());
    BitcoinLib.Bitcoin = Bitcoin;
})(BitcoinLib || (BitcoinLib = {}));
//# sourceMappingURL=Bitcoin.js.map