namespace Friday.ValueTypes {
    import IComparable = Friday.System.IComparable;
    import ArgumentException = Exceptions.ArgumentException;

    export class Guid implements IComparable<Guid>{
        public Value: string;

        public CompareTo(other: Guid): number { throw new Error("Not implemented"); }

        public GreaterThan(other: Guid): boolean { throw new Error("Not implemented"); }

        public GreaterThanOrEqual(other: Guid): boolean { throw new Error("Not implemented"); }

        public LessThan(other: Guid): boolean { throw new Error("Not implemented"); }

        public LessThanOrEqual(other: Guid): boolean { throw new Error("Not implemented"); }

        public GetHashCode(): number { throw new Error("Not implemented"); }

        public Equals(other: Guid): boolean { return this.Value === other.Value }

        public static get Empty(): Guid {
            return new Guid("00000000-0000-0000-0000-000000000000");
        }

        public static NewGuid(): Guid {
            return new Guid([this.gen(2), this.gen(1), this.gen(1), this.gen(1), this.gen(3)].join("-"));
        }

        public static IsGuid(value: Guid | string): boolean {
            return value && (value instanceof Guid || this.validator.test(value.toString()));
        }

        private static validator: RegExp = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

        private static gen(count: number): string {
            let out = "";
            for (var i = 0; i < count; i++) {
                out += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return out;
        }

        constructor(guid: string | Guid) {
            if (!Guid.IsGuid(guid)) throw new ArgumentException('guid');
            if (guid && guid instanceof Guid)
                this.Value = guid.Value;
            else if(typeof guid === "string")
                this.Value = guid;
        }

        public IsEmpty(): boolean {
            return this.Equals(Guid.Empty);
        }

        public toString(): string {
            return this.Value;
        }

        public toJSON(): string {
            return this.Value;
        }
    }
}