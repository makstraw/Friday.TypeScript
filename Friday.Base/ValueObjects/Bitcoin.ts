namespace BitcoinLib {

    export class BitcoinMultiplier {
        public Name: KnockoutObservable<string>;
        public Power: KnockoutObservable<number>;

        constructor(name: string, power: number) {
            this.Name = ko.observable(name);
            this.Power = ko.observable(power);
        }

        public toString(): string {
            return `${this.Name()}`;
        }
    }

    export class FiatCurrency {
        public Name: KnockoutObservable<string>;
        public Sign: KnockoutObservable<string>;
        public Rate: KnockoutObservable<number>;

        constructor(name: string, sign: string, rate: number) {
            this.Name = ko.observable(name);
            this.Sign = ko.observable(sign);
            this.Rate = ko.observable(rate);
        }

        public toString(): string {
            return `${this.Name()}(${this.Sign()})`;
        }
    }

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
            return new Bitcoin(mBtc * Bitcoin.getMultiplier(Bitcoin.mBTC));
        }

        public static FromBits(bits: number): Bitcoin {
            return new Bitcoin(bits * Bitcoin.getMultiplier(Bitcoin.Bits));
        }

        public static FromBtc(btc: number): Bitcoin {
            return new Bitcoin(btc * Bitcoin.getMultiplier(Bitcoin.BTC));
        }

        public static Fee(percent: number, amount: Bitcoin, min?: Bitcoin, max?: Bitcoin): Bitcoin {
            var fee = new Bitcoin(amount.ToSatoshi() * percent / 100);
            if (typeof(min) != "undefined" && fee.LessThan(min)) return Bitcoin.Clone(min);
            if (typeof (max) != "undefined" && fee.MoreThan(max)) return Bitcoin.Clone(max);
            return fee;
        }

        public static Clone(instance: Bitcoin) {
            return Bitcoin.FromSatoshi(instance.ToSatoshi());
        }

        public ToSatoshi(): number {
            return this.satoshiAmount();
        }

        public ToBits(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.Bits);
        }

        public ToBtc(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.BTC);
        }

        public ToMilliBtc(): number {
            return this.satoshiAmount() / Bitcoin.getMultiplier(Bitcoin.mBTC);
        }

        private static getMultiplier(multiplier: string): number {
            var power: number = 0;
            for (var i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name() == multiplier) {
                    power = Bitcoin.BitcoinFormatList()[i].Power();
                    break;
                }
            }
            return Math.pow(10, power);
        }

        private static trimZeroes(value: number, power: number):number {
            return parseFloat(value.toFixed(power));
        }

        private static calculate(value: number, multiplier: string): number {
            return value * Bitcoin.getMultiplier(multiplier);
        }

        public LessThan(value: Bitcoin) {
            return this.satoshiAmount() < value.satoshiAmount();
        }

        public MoreThan(value: Bitcoin) {
            return this.satoshiAmount() > value.satoshiAmount();
        }

        public Equal(value: Bitcoin) {
            return this.satoshiAmount() == value.satoshiAmount();
        }

        public MoreOrEqualThan(value: Bitcoin) {
            return (this.MoreThan(value) || this.Equal(value));
        }

        public LessOrEqualThan(value: Bitcoin) {
            return (this.LessThan(value) || this.Equal(value));
        }

        public Add(value: Bitcoin) {
            this.satoshiAmount(this.ToSatoshi() + value.ToSatoshi());
        }

        public Sub(value: Bitcoin) {
            this.satoshiAmount(this.ToSatoshi() - value.ToSatoshi());
        }

        public Set(value: Bitcoin,forceNotify=false) {
            this.satoshiAmount(value.ToSatoshi());
            if(forceNotify) this.satoshiAmount.notifySubscribers(this.satoshiAmount());
        }

        public Step: KnockoutComputed<number> = ko.pureComputed((): number => 1 / Bitcoin.getMultiplier(Bitcoin.DefaultMultiplier().Name()));

        public Power: KnockoutComputed<number> = ko.pureComputed((): number => Bitcoin.DefaultMultiplier().Power());

        public Units: KnockoutComputed<string> = ko.pureComputed(this.displayUnits,this);

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
            case Bitcoin.Satoshi:
                computedValue  = "Sat.";
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
        }

        private fromDefaultType(value: string): void {
            var parsedValue = parseFloat(value);
            var computedValue: number;
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
        }

        private toDefaultType(trailingZeroes = false): string {
            var returnValue: number;
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
            } else {
                
                if (Bitcoin.DefaultMultiplier().Name() == Bitcoin.Satoshi) return returnValue.toString();
                return this.trimTrailingZeroes(returnValue.toFixed(this.Power()));
            }    
        }
        private trimDot(value: string): string {
            if (value[value.length - 1] == ".") return value.slice(0, value.length - 1);
            return value;
        }

        private trimTrailingZeroes(value: string): string {
            for (var i = value.length - 1; i >= 1; i--) {
//                console.log(`i: ${i} value: ${value} char: ${value.charAt(i)}`);
                if (value.charAt(i) != "0") {
//                    console.log(`trig`);
                    return this.trimDot(value.slice(0, i+1));
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
        public static readonly Bits = "Bits";
        public static readonly BTC = "BTC";
        public static readonly mBTC = "mBTC";
        public static readonly Satoshi = "Satoshi";

        public static SetFormat(formatName: string) {
            for (var i = 0; i < Bitcoin.BitcoinFormatList().length; i++) {
                if (Bitcoin.BitcoinFormatList()[i].Name().toLowerCase() == formatName.toLowerCase()) {
                    Bitcoin.DefaultMultiplier(Bitcoin.BitcoinFormatList()[i]);
                }
            }
            
        }

        public static readonly BitcoinFormatList: KnockoutObservableArray<BitcoinMultiplier> = ko.observableArray([
            new BitcoinMultiplier(Bitcoin.Satoshi, 0),
            new BitcoinMultiplier(Bitcoin.Bits, 2),
            new BitcoinMultiplier(Bitcoin.mBTC, 5),
            new BitcoinMultiplier(Bitcoin.BTC, 8)
        ]);

        public static FiatRates: KnockoutObservable<FiatCurrency> = ko.observable(new FiatCurrency("USD","$",1));

        public static DefaultMultiplier: KnockoutObservable<BitcoinMultiplier> = ko.observable(Bitcoin.BitcoinFormatList()[0]);
    }
}