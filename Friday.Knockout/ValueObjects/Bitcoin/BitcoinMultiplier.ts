///<reference path="BitcoinMultiplierNames.ts"/>
namespace Friday.Knockout.ValueTypes {

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



        public static From(name: string, power: number): BitcoinMultiplier {
            return new BitcoinMultiplier(name, power);
        }

        public static get Satoshi() {
            return this.From(BitcoinMultiplierNames.Satoshi, 0);
        }

        public static get Bits() {
            return this.From(BitcoinMultiplierNames.Bits, 2);
        }

        public static get mBTC() {
            return this.From(BitcoinMultiplierNames.mBTC, 5);
        }

        public static get BTC() {
            return this.From(BitcoinMultiplierNames.BTC, 8);
        }

    }
}