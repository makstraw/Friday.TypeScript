///<reference path="../System/Interfaces/IComparable.ts"/>
///<reference path="../System/Interfaces/IBasicArithmetic.ts"/>
namespace Friday.System {
    export class Percent implements IComparable<Percent>, IBasicArithmetic<Percent>, IBasicArithmetic<number>{
        public Add(value: number): number;
        public Add(value: Percent): Percent;
        public Add(value: any): any{
            if (typeof value === "number") {
                return value + Percent.CalculatePercentAmountFromValue(value, this);
            } else if (typeof value === "object" && value instanceof Percent) {
                return Percent.From(this.Value + value.Value);
            }
        }

        public Sub(value: number): number;
        public Sub(value: Percent): Percent;
        public Sub(value: any): any {
            if (typeof value === "number") {
                return value - Percent.CalculatePercentAmountFromValue(value, this);
            } else if (typeof value === "object" && value instanceof Percent) {
                return Percent.From(this.Value - value.Value);
            }
        }


        public readonly Value: number;

        public static Zero = new Percent(0);
        public static One = new Percent(1);
        public static Ten = new Percent(10);
        public static Fifty = new Percent(50);
        public static Hundred = new Percent(100);

        public static From(value: number): Percent {
            return new Percent(value);
        }

        constructor(value: number) {
            this.Value = value;
        }

        public static CalculatePercentAmountFromValue(value: number, percent: Percent){
            return value * percent.Value / 100;
        }

        public CompareTo(other: Percent): number {
            if (this.GreaterThan(other)) return 1;
            if(this.LessThan(other)) return -1;
            return 0;
        }

        public GreaterThan(other: Percent): boolean {
            return this.Value > other.Value;
        }

        public GreaterThanOrEqual(other: Percent): boolean {
            return this.GreaterThan(other) || this.Equals(other);
        }

        public LessThan(other: Percent): boolean {
            return this.Value < other.Value;
        }

        public LessThanOrEqual(other: Percent): boolean {
            return this.LessThan(other) || this.Equals(other);
        }

        public Equals(other: Percent): boolean {
            return this.Value === other.Value;
        }

        public GetHashCode(): number {
            return this.Value ^ this.Value >> 32;
        }
    }
}