///<reference path="UnixTime.ts"/>
///<reference path="../IComparable.ts"/>
namespace Friday.ValueTypes {
    import ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
    import ArgumentException = Exceptions.ArgumentException;

    export class Interval implements IComparable<Interval> {

        public GetHashCode(): number {
            return this.Length.GetHashCode();
        }

        public static readonly SecondsInMinute = 60;
        public static readonly SecondsInHour = Interval.SecondsInMinute * 60;
        public static readonly SecondsInDay = Interval.SecondsInHour * 24;

        public get Days(): number {
            return this.Length.TimeStamp.div(Interval.SecondsInDay).toNumber();
        }

        public get Hours(): number {
            return this.Length.TimeStamp.div(Interval.SecondsInHour).toNumber();
        }

        public get Minutes(): number {
            return this.Length.TimeStamp.div(Interval.SecondsInMinute).toNumber();
        }

        public static get Empty(): Interval {
            return new Interval(UnixTime.EpochStart, UnixTime.EpochStart);
        }

        public readonly Start: UnixTime;
        public readonly End: UnixTime;
        public get Length(): UnixTime {
            return this.End.Subtract(this.Start);
        }

        constructor(start: UnixTime, end: UnixTime) {
            if (start.GreaterThan(end))
                throw new ArgumentOutOfRangeException('start');
            this.Start = start;
            this.End = end;
        }

        public ToLocalTimeInterval(): string {
            return "Start: " + this.Start.ToLocalTimeString() + " End: " + this.End.ToLocalTimeString();
        }

        public static FromTimeTillNow(startTime: DateTime): Interval;
        public static FromTimeTillNow(startTime: UnixTime): Interval;
        public static FromTimeTillNow(startTime: any): Interval {
            if (startTime instanceof DateTime) {
                return new Interval(startTime.ToUnixTime(), DateTime.UtcNow.ToUnixTime());
            } else if (startTime instanceof UnixTime) {
                return new Interval(startTime, DateTime.UtcNow.ToUnixTime());
            }
            throw new ArgumentException('startTime');
        }

        public toString(): string {
            return "Start: " + this.Start.ToUtcTimeString() + ", End: " + this.End.ToUtcTimeString();
        }

        public Equals(other: Interval) {
            return this.Start.Equals(other.Start) && this.End.Equals(other.End);
        }

        public CompareTo(other: Interval): number {
            if (this.Length.GreaterThan(other.Length)) return 1;
            if (this.Length.LessThan(other.Length)) return -1;
            return 0;
        }

        public GreaterThanOrEqual(other: Interval): boolean {
            return this.Length.GreaterThanOrEqual(other.Length);
        }

        public LessThan(other: Interval): boolean {
            return this.Length.LessThan(other.Length);
        }

        public LessThanOrEqual(other: Interval): boolean {
            return this.Length.LessThanOrEqual(other.Length);
        }

        public GreaterThan(other: Interval): boolean {
            return this.Length.GreaterThan(other.Length);
        }

        public static FromDto(dto: Interval): Interval {
            return new Interval(dto.Start, dto.End);
        }

        public toJSON(): any {
            return { Start: this.Start, End: this.End }
        }

    }
}