///<reference path="../../../Exceptions/Basic/reference_basicexceptions.ts"/>
///<reference path="../../Interfaces/IComparable.ts"/>
///<reference path="../../../Extensions/ArrayExtensions.ts"/>
namespace Friday.System {
    import NotImplementedException = Exceptions.NotImplementedException;
    import ArgumentException = Exceptions.ArgumentException;
    import ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
    import OverflowException = Exceptions.OverflowException;

    export class TimeSpan implements IComparable<TimeSpan> {
        public GetHashCode(): number {
            return this.Ticks.xor(this.Ticks.shiftRight(32)).toNumber();
        } // ReSharper disable InconsistentNaming
        public static readonly TicksPerMillisecond = Long.fromNumber(10000);
        private static readonly MillisecondsPerTick = 1.0 / TimeSpan.TicksPerMillisecond.toNumber();

        public static readonly TicksPerSecond = TimeSpan.TicksPerMillisecond.multiply(1000);   // 10,000,000
        private static readonly SecondsPerTick = 1.0 / TimeSpan.TicksPerSecond.toNumber();         // 0.0001

        public static readonly TicksPerMinute = TimeSpan.TicksPerSecond.multiply(60);         // 600,000,000
        private static readonly MinutesPerTick = 1.0 / TimeSpan.TicksPerMinute.toNumber(); // 1.6666666666667e-9

        public static readonly TicksPerHour = TimeSpan.TicksPerMinute.multiply(60);        // 36,000,000,000
        private static readonly HoursPerTick = 1.0 / TimeSpan.TicksPerHour.toNumber(); // 2.77777777777777778e-11

        public static readonly TicksPerDay = TimeSpan.TicksPerHour.multiply(24);          // 864,000,000,000
        private static readonly DaysPerTick = 1.0 / TimeSpan.TicksPerDay.toNumber(); // 1.1574074074074074074e-12

        private static readonly MillisPerSecond = 1000;
        private static readonly MillisPerMinute = TimeSpan.MillisPerSecond * 60; //     60,000
        private static readonly MillisPerHour = TimeSpan.MillisPerMinute * 60;   //  3,600,000
        private static readonly MillisPerDay = TimeSpan.MillisPerHour * 24;      // 86,400,000

        private static readonly MaxSeconds = Long.MAX_VALUE.div(TimeSpan.TicksPerSecond);
        private static readonly MinSeconds = Long.MIN_VALUE.div(TimeSpan.TicksPerSecond);

        private static readonly MaxMilliSeconds = Long.MAX_VALUE.div(TimeSpan.TicksPerMillisecond);
        private static readonly MinMilliSeconds = Long.MIN_VALUE.div(TimeSpan.TicksPerMillisecond);

        private static readonly TicksPerTenthSecond = TimeSpan.TicksPerMillisecond.multiply(100);

        public static readonly Zero = new TimeSpan(Long.ZERO);

        public static readonly MaxValue = new TimeSpan(Long.MAX_VALUE);
        public static readonly MinValue = new TimeSpan(Long.MIN_VALUE);

        public _ticks: Long;
// ReSharper restore InconsistentNaming

        constructor(ticks: Long);
        constructor(hours: number, minutes: number, seconds: number);
        constructor(days: number, hours: number, minutes: number, seconds: number);
        constructor(days: number, hours: number, minutes: number, seconds: number, milliseconds: number);
        constructor(x: any, y?: number, z?: number, z1?:number, z2?: number) {
            if (x instanceof Long) {
                this._ticks = x;
                return;
            }

            let days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;

            switch (arguments.length) {
                case 3:
                    this._ticks = TimeSpan.TimeToTicks(x, y, z);
                    return;
                case 4:
                    days = x;
                    hours = y;
                    minutes = z;
                    seconds = z1;

                    break;
                case 5:
                    days = x;
                    hours = y;
                    minutes = z;
                    seconds = z1;
                    milliseconds = z2;
                    break;
                
                default:
                    throw new ArgumentException(arguments.length.toString());
            }
            let totalMilliSeconds: Long;
            totalMilliSeconds = Long.fromNumber(days).mul(3600).mul(24);
            totalMilliSeconds = totalMilliSeconds.add(Long.fromNumber(hours).mul(3600));
            totalMilliSeconds = totalMilliSeconds.add(Long.fromNumber(minutes).mul(60));
            totalMilliSeconds = totalMilliSeconds.add(seconds);
            totalMilliSeconds = totalMilliSeconds.mul(1000).add(milliseconds);

            if (totalMilliSeconds.greaterThan(TimeSpan.MaxMilliSeconds) ||
                totalMilliSeconds.lessThan(TimeSpan.MinMilliSeconds))
                throw new ArgumentOutOfRangeException('');
            this._ticks = totalMilliSeconds.mul(TimeSpan.TicksPerMillisecond);

        }

        public get Ticks(): Long {
            return this._ticks;
        }

        public get Days(): number {
            return this._ticks.div(TimeSpan.TicksPerDay).toNumber();
        }

        public get Hours(): number {
            return this._ticks.div(TimeSpan.TicksPerHour).mod(24).toNumber();
        }

        public get Milliseconds(): number {
            return this._ticks.div(TimeSpan.TicksPerMillisecond).mod(1000).toNumber();
        }

        public get Minutes(): number {
            return this._ticks.div(TimeSpan.TicksPerMinute).mod(60).toNumber();
        }

        public get Seconds(): number {
            return this._ticks.div(TimeSpan.TicksPerSecond).mod(60).toNumber();
        }

        public get TotalDays(): number {
            return this._ticks.toNumber() * TimeSpan.DaysPerTick;
        }

        public get TotalHours(): number {
            return this._ticks.toNumber() * TimeSpan.HoursPerTick;
        }

        public get TotalMilliseconds(): number {
            let temp = this._ticks.toNumber() * TimeSpan.MillisecondsPerTick;
            if (TimeSpan.MaxMilliSeconds.lessThan(temp)) return TimeSpan.MaxMilliSeconds.toNumber();
            if (TimeSpan.MinMilliSeconds.greaterThan(temp)) return TimeSpan.MinMilliSeconds.toNumber();
            return temp;
        }

        public get TotalMinutes(): number {
            return this._ticks.toNumber() * TimeSpan.MinutesPerTick;
        }

        public get TotalSeconds(): number {
            return this._ticks.toNumber() * TimeSpan.SecondsPerTick;
        }

        public Add(ts: TimeSpan): TimeSpan {
            let result: Long = this._ticks.add(ts._ticks);
            if ((this._ticks.shiftRight(63).equals(ts._ticks.shiftRight(63))) && (this._ticks.shiftRight(63).notEquals(result.shiftRight(63))))
                throw new OverflowException();
            return new TimeSpan(result);

        }

        public static Compare(t1: TimeSpan, t2: TimeSpan): number {
            if (t1._ticks.greaterThan(t2._ticks)) return 1;
            if (t1._ticks.lessThan(t2._ticks)) return -1;
            return 0;
        }

        public CompareTo(other: TimeSpan): number {
            return TimeSpan.Compare(this, other);
        }

        public GreaterThan(other: TimeSpan): boolean {
            return this.Ticks.greaterThan(other.Ticks);
        }

        public GreaterThanOrEqual(other: TimeSpan): boolean {
            return this.Ticks.greaterThanOrEqual(other.Ticks);
        }

        public LessThan(other: TimeSpan): boolean {
            return this.Ticks.lessThan(other.Ticks);
        }

        public LessThanOrEqual(other: TimeSpan): boolean {
            return this.Ticks.lessThanOrEqual(other.Ticks);
        }

        public static FromDays(value: number): TimeSpan {
            return TimeSpan.Interval(value, TimeSpan.MillisPerDay);
        }

        public Duration(): TimeSpan {
            if (this.Ticks.equals(TimeSpan.MinValue.Ticks)) throw new OverflowException();
            return new TimeSpan(this._ticks.greaterThanOrEqual(0) ? this._ticks : this._ticks.negate());
        }

        public Equals(obj: TimeSpan): boolean {
            return this._ticks.equals(obj._ticks);
        }

        public static FromHours(value: number): TimeSpan {
            return TimeSpan.Interval(value, TimeSpan.MillisPerHour);
        }

        public static Interval(value: number, scale: number) : TimeSpan {
            if (isNaN(value)) throw new ArgumentException('value');
            let tmp = value * scale;
            let millis = tmp + (value >= 0 ? 0.5 : -0.5);
            if (millis > Long.MAX_VALUE.div(TimeSpan.TicksPerMillisecond).toNumber() ||
                millis < Long.MIN_VALUE.div(TimeSpan.TicksPerMillisecond).toNumber()) throw new OverflowException();
            return new TimeSpan(Long.fromNumber(millis).mul(TimeSpan.TicksPerMillisecond));
        }

        public static FromMilliseconds(value: number): TimeSpan {
            return TimeSpan.Interval(value, 1);
        }

        public static FromMinutes(value: number): TimeSpan {
            return TimeSpan.Interval(value, TimeSpan.MillisPerMinute);
        }

        public Negate(): TimeSpan {
            if (this.Ticks == TimeSpan.MinValue.Ticks)
                throw new OverflowException();
            return new TimeSpan(this._ticks.negate());
        }

        public static FromSeconds(value: number): TimeSpan {
            return TimeSpan.Interval(value, TimeSpan.MillisPerSecond);
        }

        public Subtract(ts: TimeSpan): TimeSpan {
            let result: Long = this._ticks.sub(ts._ticks);
            if ((this._ticks.shiftRight(63).equals(ts._ticks.shiftRight(63))) && (this._ticks.shiftRight(63).notEquals(result.shiftRight(63))))
                throw new OverflowException();
            return new TimeSpan(result);
        }

        public static FromTicks(value: Long): TimeSpan {
            return new TimeSpan(value);
        }

        public static FromCSharpString(value: string): TimeSpan {
            let parts = value.split(":");
            return this.FromTicks(this.TimeToTicks(parseInt(parts[0]),parseInt(parts[1]),parseInt(parts[2])));
        }

        public static TimeToTicks(hour: number, minute: number, second: number): Long {
            let totalSeconds = Long.fromNumber(hour).mul(3600).add(minute * 60).add(second);
            if (totalSeconds.greaterThan(TimeSpan.MaxSeconds) || totalSeconds.lessThan(TimeSpan.MinSeconds))
                throw new ArgumentOutOfRangeException('hour,minute,second');
            return totalSeconds.mul(TimeSpan.TicksPerSecond);
        }
    }
}