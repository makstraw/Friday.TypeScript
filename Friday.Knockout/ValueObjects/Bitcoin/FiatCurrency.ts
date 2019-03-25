namespace Friday.Knockout.ValueTypes {
    export class FiatCurrency {
        public Name: KnockoutObservable<string>;
        public Sign: KnockoutObservable<string>;
        public Rate: KnockoutObservable<number>;

        constructor(name: string, sign: string, rate: number = 1) {
            this.Name = ko.observable(name);
            this.Sign = ko.observable(sign);
            this.Rate = ko.observable(rate);
        }

        public toString(): string {
            return `${this.Name()}(${this.Sign()})`;
        }

        public static From(name: string, sign: string): FiatCurrency {
            return new FiatCurrency(name, sign);
        }

        public static get Dummy(): FiatCurrency {
            return this.From("Dummy", "D");
        }
    }
}