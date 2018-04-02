///<reference path="../../../Utility/MethodHelper.ts"/>
///<reference path="../../../Exceptions/Basic/reference_basicexceptions.ts"/>
///<reference path="../../Interfaces/IComparable.ts"/>
///<reference path="TimeSpan.ts"/>
namespace Friday.System {
    import ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
    import ArgumentException = Exceptions.ArgumentException;
    import checkArgumentType = Utility.checkArgumentType;
    import NotImplementedException = Exceptions.NotImplementedException;

    export enum DateTimeKind {
        Unspecified,
        Utc,
        Local
    }

    export enum DayOfWeek {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6
    }

    export class DateTime implements IComparable<DateTime> {
        public GetHashCode(): number {
            return this.InternalTicks.xor(this.InternalTicks.shiftRight(32)).toNumber();
        }

        // ReSharper disable InconsistentNaming
        public get InternalTicks(): Long {
            return this.dateData.and(DateTime.TicksMask).toSigned();
        }

        public get InternalKind(): Long {
            return this.dateData.and(DateTime.FlagsMask);
        }

        public get Date(): DateTime {
            return new DateTime(
                this.InternalTicks.sub(this.InternalTicks.mod(DateTime.TicksPerDay).or(this.InternalKind)).toUnsigned());
        }

        public get Day(): number {
            return this.GetDatePart(DateTime.DatePartDay);
        }

        public get DayOfWeek(): DayOfWeek {
            return this.InternalTicks.div(DateTime.TicksPerDay).add(1).mod(7).toNumber() as DayOfWeek;
        }

        public get DayOfYear(): number {
            return this.GetDatePart(DateTime.DatePartDayOfYear);
        }

        public get Hour(): number {
            return this.InternalTicks.div(DateTime.TicksPerHour).mod(24).toNumber(); 
        }

        public get Kind(): DateTimeKind {
            switch (this.InternalKind) {
                case DateTime.KindUnspecified:
                    return DateTimeKind.Unspecified;
                case DateTime.KindUtc:
                    return DateTimeKind.Utc;
                default:
                    return DateTimeKind.Local;
            }
        }

        public get Millisecond(): number {
            return this.InternalTicks.div(DateTime.TicksPerMillisecond).mod(1000).toNumber();
        }

        public get Minute(): number {
            return this.InternalTicks.div(DateTime.TicksPerMinute).mod(60).toNumber();
        }

        public get Month(): number {
            return this.GetDatePart(DateTime.DatePartMonth);
        }

        public static get Now(): DateTime {
            let milliseconds = Date.now() - (new Date().getTimezoneOffset() * DateTime.MillisPerMinute);
            return new DateTime(Long.fromNumber(milliseconds, true).multiply(DateTime.TicksPerMillisecond).add(Long.fromNumber(DateTime.DaysTo1970).mul(DateTime.TicksPerDay)));
        }

        public static get UtcNow(): DateTime {
            let milliseconds = new Date().getTime();
            return new DateTime(Long.fromNumber(milliseconds, true).multiply(DateTime.TicksPerMillisecond).add(Long.fromNumber(DateTime.DaysTo1970).mul(DateTime.TicksPerDay)));
        }

        public get Second(): number {
            return this.InternalTicks.div(DateTime.TicksPerSecond).mod(60).toNumber();
        }

        public get Ticks(): Long {
            return this.InternalTicks;
        }

        public get TimeOfDay(): TimeSpan{
            return new TimeSpan(this.InternalTicks.mod(DateTime.TicksPerDay));
        }

        public static get Today(): DateTime {
            return DateTime.Now.Date;
        }

        public get Year(): number {
            return this.GetDatePart(DateTime.DatePartYear);
        }

        // Number of 100ns ticks per time unit
        private static readonly TicksPerMillisecond: Long = Long.fromNumber(10000); //long
        private static readonly TicksPerSecond: Long = DateTime.TicksPerMillisecond.multiply(1000); //long
        private static readonly TicksPerMinute: Long = DateTime.TicksPerSecond.multiply(60); //long
        private static readonly TicksPerHour: Long = DateTime.TicksPerMinute.multiply(60); //long
        private static readonly TicksPerDay: Long = DateTime.TicksPerHour.multiply(24); //long

        // Number of milliseconds per time unit
        private static readonly MillisPerSecond = 1000;
        private static readonly MillisPerMinute = DateTime.MillisPerSecond * 60;
        private static readonly MillisPerHour = DateTime.MillisPerMinute * 60;
        private static readonly MillisPerDay = DateTime.MillisPerHour * 24;

        // Number of days in a non-leap year
        private static readonly DaysPerYear = 365;
        // Number of days in 4 years
        private static readonly DaysPer4Years = DateTime.DaysPerYear * 4 + 1;       // 1461
        // Number of days in 100 years
        private static readonly DaysPer100Years = DateTime.DaysPer4Years * 25 - 1;  // 36524
        // Number of days in 400 years
        private static readonly DaysPer400Years = DateTime.DaysPer100Years * 4 + 1; // 146097

        // Number of days from 1/1/0001 to 12/31/1600
        private static readonly DaysTo1601 = DateTime.DaysPer400Years * 4;          // 584388
        // Number of days from 1/1/0001 to 12/30/1899
        private static readonly DaysTo1899 = DateTime.DaysPer400Years * 4 + DateTime.DaysPer100Years * 3 - 367;
        // Number of days from 1/1/0001 to 12/31/1969
        private static readonly DaysTo1970 = DateTime.DaysPer400Years * 4 + DateTime.DaysPer100Years * 3 + DateTime.DaysPer4Years * 17 + DateTime.DaysPerYear; // 719,162
        // Number of days from 1/1/0001 to 12/31/9999
        private static readonly DaysTo10000 = DateTime.DaysPer400Years * 25 - 366;  // 3652059

        private static readonly MinTicks = Long.fromNumber(0);
        private static readonly MaxTicks: Long = Long.fromNumber(DateTime.DaysTo10000).multiply(DateTime.TicksPerDay.subtract(1)); //long
        private static readonly MaxMillis: Long = Long.fromNumber(DateTime.DaysTo10000).multiply(DateTime.MillisPerDay); //long

        private static readonly FileTimeOffset: Long = Long.fromNumber(DateTime.DaysTo1601).multiply(DateTime.TicksPerDay); //long
        private static readonly DoubleDateOffset: Long = Long.fromNumber(DateTime.DaysTo1899).multiply(DateTime.TicksPerDay); //long
        // The minimum OA date is 0100/01/01 (Note it's year 100).
        // The maximum OA date is 9999/12/31
        private static readonly OADateMinAsTicks: Long = Long.fromNumber(DateTime.DaysPer100Years - DateTime.DaysPerYear).multiply(DateTime.TicksPerDay); //long
        // All OA dates must be greater than (not >=) OADateMinAsDouble
        private static readonly OADateMinAsDouble = -657435.0;
        // All OA dates must be less than (not <=) OADateMaxAsDouble
        private static readonly OADateMaxAsDouble = 2958466.0;

        private static readonly DatePartYear = 0;
        private static readonly DatePartDayOfYear = 1;
        private static readonly DatePartMonth = 2;
        private static readonly DatePartDay = 3;

        private static readonly DaysToMonth365: Array<number> = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
        private static readonly DaysToMonth366: Array<number> = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];

        public static readonly MinValue: DateTime = new DateTime(DateTime.MinTicks, DateTimeKind.Unspecified);
        public static readonly MaxValue: DateTime = new DateTime(DateTime.MaxTicks, DateTimeKind.Unspecified);

        private static readonly TicksMask = Long.fromString("3FFFFFFFFFFFFFFF", true, 16); //UInt64
        private static readonly FlagsMask = Long.fromString("C000000000000000", true, 16); //UInt64
        private static readonly LocalMask = Long.fromString("8000000000000000", true, 16); //UInt64
        private static readonly TicksCeiling = Long.fromString("4000000000000000", false, 16); //Int64
        private static readonly KindUnspecified = Long.fromString("0000000000000000", true, 16); //UInt64
        private static readonly KindUtc = Long.fromString("4000000000000000", true, 16); //UInt64
        private static readonly KindLocal = Long.fromString("8000000000000000", true, 16); //UInt64
        private static readonly KindLocalAmbiguousDst = Long.fromString("C000000000000000", true, 16);
        private static readonly KindShift = 62;

        private static readonly TicksField = "ticks";
        private static readonly DateDataField = "dateData";
        // The data is stored as an unsigned 64-bit integeter
        //   Bits 01-62: The value of 100-nanosecond ticks where 0 represents 1/1/0001 12:00am, up until the value
        //               12/31/9999 23:59:59.9999999
        //   Bits 63-64: A four-state value that describes the DateTimeKind value of the date time, with a 2nd
        //               value for the rare case where the date time is local, but is in an overlapped daylight
        //               savings time hour and it is in daylight savings time. This allows distinction of these
        //               otherwise ambiguous local times and prevents data loss when round tripping from Local to
        //               UTC time.
        private dateData: Long;
        // ReSharper restore InconsistentNaming

        constructor(ticks: Long, kind?: DateTimeKind);
        constructor(year: number, month: number, day: number);
        constructor(year: number, month: number, day: number, hours: number, minutes: number, seconds: number, kind?: DateTimeKind);
        constructor(year: number, month: number, day: number, hours: number, minutes: number, seconds: number, miliseconds: number, kind?: DateTimeKind);
        constructor(x: any, y?: any, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number, kind?: DateTimeKind) {
            if (typeof x != "number") {
                let ticks = x as Long;

                if (ticks.unsigned) {
                    this.dateData = ticks;
                    return;
                }

                if (ticks.lessThan(DateTime.MinTicks) || ticks.greaterThan(DateTime.MaxTicks))
                    throw new ArgumentOutOfRangeException('ticks');

                if (typeof y == "number") {
                    if (y < DateTimeKind.Unspecified || y > DateTimeKind.Local) throw new ArgumentException('kind');
                    let kind = y as DateTimeKind;
                    this.dateData = ticks.or(Long.fromNumber(kind).shiftLeft(DateTime.KindShift)).toUnsigned();
                } else this.dateData = ticks.toUnsigned();
            } else {
                let year = x as number;
                let month = y as number;

                if (!checkArgumentType("number", x, y, day)) throw new ArgumentException("year,month,day");
                let ticks = DateTime.DateToTicks(year, month, day);

                if (checkArgumentType("number", hours, minutes, seconds)) {
                    ticks.add(DateTime.TimeToTicks(hours, minutes, seconds));
                }

                if (typeof milliseconds == "number") {
                    if (milliseconds < 0 || milliseconds >= DateTime.MillisPerSecond)
                        throw new ArgumentOutOfRangeException("milliseconds");
                    ticks.add(DateTime.TicksPerMillisecond.multiply(milliseconds));
                }

                if (typeof kind == "number")
                    this.dateData = ticks.or(Long.fromNumber(kind).shiftLeft(DateTime.KindShift)).toUnsigned();
                else this.dateData = ticks.toUnsigned();

            }

        }

        public static IsLeapYear(year: number): boolean {
            if (year < 1 || year > 9999) {
                throw new ArgumentOutOfRangeException("year");
            }
            return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        }
        // Returns the tick count corresponding to the given year, month, and day.
        // Will check the if the parameters are valid.
        private static DateToTicks(year: number, month: number, day: number): Long {
            if (year >= 1 && year <= 9999 && month >= 1 && month <= 12) {
                let days: Array<number> = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
                if (day >= 1 && day <= days[month] - days[month - 1]) {
                    let y = year - 1;
                    let n = y * 365 + y / 4 - y / 100 + y / 400 + days[month - 1] + day - 1;
                    return Long.fromNumber(n, true).multiply(DateTime.TicksPerDay);
                }
                throw new ArgumentOutOfRangeException("day");
            }
            throw new ArgumentOutOfRangeException("year,month");
        }

        private static TimeToTicks(hour: number, minute: number, second: number): Long {
            //TimeSpan.TimeToTicks is a family access function which does no error checking, so
            //we need to put some error checking out here.
            if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60) {
                return (TimeSpan.TimeToTicks(hour, minute, second));
            }
            throw new ArgumentOutOfRangeException("hour,minute,second");
        }

        public Subtract(value: DateTime): TimeSpan;
        public Subtract(value: TimeSpan): DateTime;
        public Subtract(value: any): any {
            if (value instanceof DateTime) {
                return new TimeSpan(this.InternalTicks.sub(value.InternalTicks));
            }

            if (value instanceof TimeSpan) {
                if (this.InternalTicks.sub(DateTime.MinTicks).lessThan(value._ticks) ||
                    this.InternalTicks.sub(DateTime.MaxTicks).greaterThan(value._ticks))
                    throw new ArgumentOutOfRangeException('value');
                return new DateTime(this.InternalTicks.sub(value._ticks).or(this.InternalKind));
            }
            throw new ArgumentException("value");

        }

        public AddTicks(value: Long): DateTime {
            let ticks = this.InternalTicks;
            if (value.greaterThan(DateTime.MaxTicks.sub(ticks)) || value.lessThan(DateTime.MinTicks.sub(ticks)))
                throw new ArgumentOutOfRangeException("value");
            return new DateTime(ticks.add(value));
//            return new DateTime(ticks.add(value).or(this.InternalKind));
        }

        public Add(value: TimeSpan): DateTime;
        public Add(value: number, scale: number): DateTime;
        public Add(value: any, scale?: number): DateTime {
            if (typeof value == "number") {
                let millis: Long = Long.fromNumber(value).multiply(scale); //+ (value >= 0? 0.5: -0.5);
                return this.AddTicks(millis.multiply(DateTime.TicksPerMillisecond));
            } else return this.AddTicks(value._ticks);
        }

        public AddSeconds(value: number): DateTime {
            return this.Add(value, DateTime.MillisPerSecond);
        }

        public AddDays(value: number): DateTime {
            return this.Add(value, DateTime.MillisPerDay);
        }

        public AddHours(value: number): DateTime {
            return this.Add(value, DateTime.MillisPerHour);
        }

        public AddMinutes(value: number): DateTime {
            return this.Add(value, DateTime.MillisPerMinute);
        }

        public AddMonths(months: number): DateTime {
            if (months < -120000 || months > 120000) throw new ArgumentOutOfRangeException('months');
            let y = this.GetDatePart(DateTime.DatePartYear);
            let m = this.GetDatePart(DateTime.DatePartMonth);
            let d = this.GetDatePart(DateTime.DatePartDay);
            let i = m - 1 + months;
            if (i >= 0) {
                m = i % 12 + 1;
                y = y + i / 12;
            }
            else {
                m = 12 + (i + 1) % 12;
                y = y + (i - 11) / 12;
            }
            if (y < 1 || y > 9999) {
                throw new ArgumentOutOfRangeException('months');
            }
            let days = DateTime.DaysInMonth(y, m);
            if (d > days) d = days;
            return new DateTime(
                (DateTime.DateToTicks(y, m, d).add(this.InternalTicks.mod(DateTime.TicksPerDay))).or(this.InternalKind).toUnsigned()
            );
        }

        public AddYears(value: number): DateTime {
        if (value < -10000 || value > 10000) throw new ArgumentOutOfRangeException("years");
            return this.AddMonths(value * 12);
        }

        public static Compare(t1: DateTime, t2: DateTime): number {
            if (t1.InternalTicks.greaterThan(t2.InternalTicks)) return 1;
            if (t1.InternalTicks.lessThan(t2.InternalTicks)) return -1;
            return 0;
        }

        public CompareTo(other: DateTime): number {
            return DateTime.Compare(this, other);
        }

//        public static Equals(t1: DateTime, t2: DateTime): boolean {
//            return t1.InternalTicks.equals(t2.InternalTicks);
//        }

        public Equals(other: DateTime): boolean {
            return this.InternalTicks.equals(other.InternalTicks);
//            return DateTime.Equals(this, other);
        }

        public GreaterThan(other: DateTime): boolean {
            return this.InternalTicks.greaterThan(other.InternalTicks);
        }

        public GreaterThanOrEqual(other: DateTime): boolean {
            return this.InternalTicks.greaterThanOrEqual(other.InternalTicks);
        }

        public LessThan(other: DateTime): boolean {
            return this.InternalTicks.lessThan(other.InternalTicks);
        }

        public LessThanOrEqual(other: DateTime): boolean {
            return this.InternalTicks.lessThanOrEqual(other.InternalTicks);
        } 

        public static DaysInMonth(year: number, month: number) {
            if (month < 1 || month > 12) throw new ArgumentOutOfRangeException("month");
            let days = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
            return days[month] - days[month - 1];
        }

        public static FromFileTime(fileTime: Long): DateTime {
            return DateTime.FromFileTimeUtc(fileTime).ToLocalTime();
        }

        public static FromFileTimeUtc(fileTime: Long): DateTime {
            if (fileTime.lessThan(0) || fileTime.greaterThan(DateTime.MaxTicks.sub(DateTime.FileTimeOffset)))
                throw new ArgumentOutOfRangeException("fileTime");
            let universalTicks = fileTime.add(DateTime.FileTimeOffset);
            return new DateTime(universalTicks, DateTimeKind.Utc);
        }

        public IsDaylightSavingTime(): boolean {
//            if (Kind == DateTimeKind.Utc) {
//                return false;
//            }
//            return TimeZoneInfo.Local.IsDaylightSavingTime(this, TimeZoneInfoOptions.NoThrowOnInvalidTime);
            throw new NotImplementedException('IsDaylightSavingTime');
        }

        public static SpecifyKind(value: DateTime, kind: DateTimeKind): DateTime {
            return new DateTime(value.InternalTicks, kind);
        }

        private GetDatePart(part: number): number {
            // n = number of days since 1/1/0001
            let n = this.InternalTicks.div(DateTime.TicksPerDay);
            // y400 = number of whole 400-year periods since 1/1/0001
            let y400 = n.div(DateTime.DaysPer400Years).toNumber();
            // n = day number within 400-year period
            n = n.sub(y400 * DateTime.DaysPer400Years);
            // y100 = number of whole 100-year periods within 400-year period
            let y100 = n.div(DateTime.DaysPer100Years).toNumber();
            // Last 100-year period has an extra day, so decrement result if 4
            if (y100 == 4) y100 = 3;
            // n = day number within 100-year period
            n = n.sub(y100 * DateTime.DaysPer100Years);
            // y4 = number of whole 4-year periods within 100-year period
            let y4 = n.div(DateTime.DaysPer4Years).toNumber();
            // n = day number within 4-year period
            n = n.sub(y4 * DateTime.DaysPer4Years);
            // y1 = number of whole years within 4-year period
            let y1 = n.div(DateTime.DaysPerYear).toNumber();
            // Last year has an extra day, so decrement result if 4
            if (y1 == 4) y1 = 3;
            // If year was requested, compute and return it
            if (part == DateTime.DatePartYear) {
                return y400 * 400 + y100 * 100 + y4 * 4 + y1 + 1;
            }
            // n = day number within year
            n = n.sub(y1 * DateTime.DaysPerYear);
            // If day-of-year was requested, return it
            if (part == DateTime.DatePartDayOfYear) return n.add(1).toNumber();
            // Leap year calculation looks different from IsLeapYear since y1, y4,
            // and y100 are relative to year 1, not year 0
            let leapYear = y1 == 3 && (y4 != 24 || y100 == 3);
            let days = leapYear ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
            // All months have less than 32 days, so n >> 5 is a good conservative
            // estimate for the month
            let m = n.shiftRight(5).add(1).toNumber();
            // m = 1-based month number
            while (n.greaterThanOrEqual(days[m])) m++;
            // If month was requested, return it
            if (part == DateTime.DatePartMonth) return m;
            // Return 1-based day-of-month
            return n.sub(days[m - 1]).add(1).toNumber();
        }

        public ToLocalTime(): DateTime {
            throw new NotImplementedException('ToLocalTime');
        }
    }
}