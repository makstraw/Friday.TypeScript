///<reference path="FiatCurrency.ts"/>
///<reference path="BitcoinMultiplier.ts"/>
///<reference path="../../Definitions/knockout.d.ts"/>
///<reference path="../../../Friday.Base/ValueObjects/Percent.ts"/>
namespace Friday.Knockout.ValueTypes {
    import Percent = Friday.ValueTypes.Percent;

    export class Bitcoin {
        private satoshiAmount: KnockoutObservable<number> = ko.observable(0);

        constructor(satoshiAmount: number) {
            this.satoshiAmount(parseInt(satoshiAmount.toFixed(0)));
        }

        public static FromSatoshi(satoshi: number): Bitcoin {
            if (isNaN(satoshi)) satoshi = 0;
            return new Bitcoin(satoshi);
        }

        public static FromMilliBtc(mBtc: number): Bitcoin {
            return new Bitcoin(mBtc * Bitcoin.getMultiplier(BitcoinMultiplierNames.mBTC));
        }

        public static FromBits(bits: number): Bitcoin {
            return new Bitcoin(bits * Bitcoin.getMultiplier(BitcoinMultiplierNames.Bits));
        }

        public static FromBtc(btc: number): Bitcoin {
            return new Bitcoin(btc * Bitcoin.getMultiplier(BitcoinMultiplierNames.BTC));
        }

        public Fee(percent: number | Percent, min?: Bitcoin, max?: Bitcoin): Bitcoin {
            let fee: Bitcoin;
            if (percent instanceof Percent)
                fee = Bitcoin.FromSatoshi(this.ToSatoshi() * percent.Value / 100);
            else fee = Bitcoin.FromSatoshi(this.ToSatoshi() * percent / 100);
            if (typeof (min) !== "undefined" && fee.LessThan(min)) return Bitcoin.Clone(min);
            if (typeof (max) !== "undefined" && fee.MoreThan(max)) return Bitcoin.Clone(max);
            return fee;
        }

        public get IsZero(): boolean {
            return this.satoshiAmount() === 0;
        }

        public static Clone(instance: Bitcoin) {
            return Bitcoin.FromSatoshi(instance.ToSatoshi());
        }

        public ToSatoshi(): number {
            return this.satoshiAmount();
        }

        public ToBits(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(BitcoinMultiplierNames.Bits);
        }

        public ToBtc(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(BitcoinMultiplierNames.BTC);
        }

        public ToMilliBtc(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(BitcoinMultiplierNames.mBTC);
        }

        private static getMultiplier(multiplier: string): number {
            let power: number = 0;
            for (let i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name() === multiplier) {
                    power = Bitcoin.BitcoinFormatList()[i].Power();
                    break;
                }
            }
            return Math.pow(10, power);
        }

        private static trimZeroes(value: number, power: number): number {
            return parseFloat(value.toFixed(power));
        }

        private static calculate(value: number, multiplier: string): number {
            return value * Bitcoin.getMultiplier(multiplier);
        }

        public LessThan(value: Bitcoin): boolean {
            return this.satoshiAmount() < value.satoshiAmount();
        }

        public MoreThan(value: Bitcoin): boolean {
            return this.satoshiAmount() > value.satoshiAmount();
        }

        public Equal(value: Bitcoin): boolean {
            return this.satoshiAmount() == value.satoshiAmount();
        }

        public MoreOrEqualThan(value: Bitcoin): boolean {
            return (this.MoreThan(value) || this.Equal(value));
        }

        public LessOrEqualThan(value: Bitcoin): boolean {
            return (this.LessThan(value) || this.Equal(value));
        }

        public Add(value: Bitcoin): Bitcoin {
            this.satoshiAmount(this.ToSatoshi() + value.ToSatoshi());
            return this;
        }

        public Sub(value: Bitcoin): Bitcoin {
            this.satoshiAmount(this.ToSatoshi() - value.ToSatoshi());
            return this;
        }

        public Set(value: Bitcoin, forceNotify = false) {
            this.satoshiAmount(value.ToSatoshi());
            if (forceNotify) this.satoshiAmount.notifySubscribers(this.satoshiAmount());
        }

        public Step: KnockoutComputed<number> = ko.pureComputed((): number => 1 / Bitcoin.getMultiplier(Bitcoin.DefaultMultiplier().Name()));

        public Power: KnockoutComputed<number> = ko.pureComputed((): number => Bitcoin.DefaultMultiplier().Power());

        public Units: KnockoutComputed<string> = ko.pureComputed(this.displayUnits, this);

        public Display: KnockoutComputed<string> = ko.pureComputed(this.toDefaultType, this);

        public Fiat: KnockoutComputed<number> = ko.pureComputed(this.toFiat, this);

        public FiatName: KnockoutComputed<string> = ko.pureComputed((): string => Bitcoin.FiatRates().Name());
        public FiatSign: KnockoutComputed<string> = ko.pureComputed((): string => Bitcoin.FiatRates().Sign());

        private toFiat(): number {
            var value = this.ToBtc() * Bitcoin.FiatRates().Rate();
            if (value.toString() == "NaN")
                return 0;
            else return value;
        }

        public BtcFiatDisplay: KnockoutComputed<string> = ko.pureComputed((): string => {
            return `${this.FiatSign() + this.toFiat().toFixed(2)} / ${this.toDefaultType()} ${this.displayUnits()}`;
        }, this);

        public Input: KnockoutComputed<string> = ko.computed({
            read: this.toDefaultType,
            write: this.fromDefaultType,
            owner: this
        });

        private displayUnits(): string {
            var computedValue: string;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case BitcoinMultiplierNames.Satoshi:
                    computedValue = "Sat.";
                    break;
                case BitcoinMultiplierNames.Bits:
                    computedValue = "Bits";
                    break;
                case BitcoinMultiplierNames.mBTC:
                    computedValue = "mBTC";
                    break;
                case BitcoinMultiplierNames.BTC:
                    computedValue = "BTC";
                    break;

                default:
                    computedValue = "Sat.";
            }
            return computedValue;
        }

        private fromDefaultType(value: string): void {
            var parsedValue = parseFloat(value);
            var computedValue: number;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case BitcoinMultiplierNames.Satoshi:
                    computedValue = Bitcoin.FromSatoshi(parsedValue).ToSatoshi();
                    break;
                case BitcoinMultiplierNames.Bits:
                    computedValue = Bitcoin.FromBits(parsedValue).ToSatoshi();
                    break;
                case BitcoinMultiplierNames.mBTC:
                    computedValue = Bitcoin.FromMilliBtc(parsedValue).ToSatoshi();
                    break;
                case BitcoinMultiplierNames.BTC:
                    computedValue = Bitcoin.FromBtc(parsedValue).ToSatoshi();
                    break;

                default:
                    computedValue = Bitcoin.FromSatoshi(parsedValue).ToSatoshi();
            }

            this.satoshiAmount(computedValue);
        }

        private toDefaultType(trailingZeroes = false): string {
            var returnValue: number;
            switch (Bitcoin.DefaultMultiplier().Name()) {
                case BitcoinMultiplierNames.Satoshi:
                    returnValue = this.ToSatoshi();
                    break;
                case BitcoinMultiplierNames.Bits:
                    returnValue = this.ToBits();
                    break;
                case BitcoinMultiplierNames.mBTC:
                    returnValue = this.ToMilliBtc();
                    break;
                case BitcoinMultiplierNames.BTC:
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
            } else {

                if (Bitcoin.DefaultMultiplier().Name() === BitcoinMultiplierNames.Satoshi) return returnValue.toString();
                return this.trimTrailingZeroes(returnValue.toFixed(this.Power()));
            }
        }

        private trimDot(value: string): string {
            if (value[value.length - 1] === ".") return value.slice(0, value.length - 1);
            return value;
        }

        private trimTrailingZeroes(value: string): string {
            for (var i = value.length - 1; i >= 1; i--) {
                //                console.log(`i: ${i} value: ${value} char: ${value.charAt(i)}`);
                if (value.charAt(i) != "0") {
                    //                    console.log(`trig`);
                    return this.trimDot(value.slice(0, i + 1));
                }
            }
            return value;
        }

        // ReSharper disable once InconsistentNaming
        public valueOf(): number {
            return this.satoshiAmount();
        }


        // ReSharper disable once InconsistentNaming
        public toString(): string {
            return this.satoshiAmount.toString();
        }

        public toJSON(): number {
            return this.satoshiAmount();
        }



        public static SetFormat(formatName: string) {
            for (var i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name().toLowerCase() == formatName.toLowerCase()) {
                    Bitcoin.DefaultMultiplier(Bitcoin.BitcoinFormatList()[i]);
                }
            }

        }

        public static readonly BitcoinFormatList: KnockoutObservableArray<BitcoinMultiplier> = ko.observableArray([
            BitcoinMultiplier.Satoshi,
            BitcoinMultiplier.Bits,
            BitcoinMultiplier.mBTC,
            BitcoinMultiplier.BTC
        ]);

        public static FiatRates: KnockoutObservable<FiatCurrency> = ko.observable(FiatCurrency.Dummy);

        public static DefaultMultiplier: KnockoutObservable<BitcoinMultiplier> = ko.observable(Bitcoin.BitcoinFormatList()[0]);

        public static get Zero(): Bitcoin {
            return Bitcoin.FromSatoshi(0);
        }
    }

}