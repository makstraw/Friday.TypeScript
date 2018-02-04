///<reference path="../../Definitions/long.d.ts"/>
///<reference path="../../Utility/MethodHelper.ts"/>
namespace Friday.ValueTypes {
    import ArgumentOutOfRangeException = Exceptions.ArgumentOutOfRangeException;
    import ArgumentException = Exceptions.ArgumentException;
    import checkArgumentType = Utility.checkArgumentType;

    export enum DateTimeKind {
        Unspecified,
        Utc,
        Local
    }

    export class DateTime {


        // Number of 100ns ticks per time unit
        // ReSharper disable InconsistentNaming
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

        private static readonly DatePartDayOfYear = 1;
        private static readonly DatePartMonth = 2;
        private static readonly DatePartDay = 3;

        private static readonly DaysToMonth365: Array<number> = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
        private static readonly DaysToMonth366: Array<number> = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];

        public static readonly MinValue: DateTime = new DateTime(DateTime.MinTicks, DateTimeKind.Unspecified);
        public static readonly MaxValue: DateTime = new DateTime(DateTime.MaxTicks, DateTimeKind.Unspecified);

        private static readonly TicksMask = Long.fromString("0x3FFFFFFFFFFFFFFF", true, 8); //UInt64
        private static readonly FlagsMask = Long.fromString("0xC000000000000000", true, 8); //UInt64
        private static readonly LocalMask = Long.fromString("0x8000000000000000", true, 8); //UInt64
        private static readonly TicksCeiling = Long.fromString("0x4000000000000000", false, 8); //Int64
        private static readonly KindUnspecified = Long.fromString("0x0000000000000000", true, 8); //UInt64
        private static readonly KindUtc = Long.fromString("0x4000000000000000", true, 8); //UInt64
        private static readonly KindLocal = Long.fromString("0x8000000000000000", true, 8); //UInt64
        private static readonly KindLocalAmbiguousDst = Long.fromString("0xC000000000000000", true, 8);
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

                if (!x.unsigned && (x.lessThan(DateTime.MinTicks) || x.moreThan(DateTime.MaxTicks)))
                    throw new ArgumentOutOfRangeException('ticks');

                if (typeof y == "number") {
                    if (y < DateTimeKind.Unspecified || y > DateTimeKind.Local) throw new ArgumentException('kind');
                    let kind = y as DateTimeKind;
                    this.dateData = Long.fromNumber(0, true).add(x).or(Long.fromNumber(kind).shiftLeft(DateTime.KindShift));
                } else this.dateData = Long.fromNumber(0, true).add(x);
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
                    this.dateData = Long.fromNumber(0, true).add(ticks)
                        .or(Long.fromNumber(kind).shiftLeft(DateTime.KindShift));
                else this.dateData = ticks;

            }

        }

        private static IsLeapYear(year: number): boolean {
            throw new NotImplementedException('IsLeapYear');
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



        public Add(value: TimeSpan): DateTime;
        public Add(value: number, scale: number): DateTime;
        public Add(value: any, scale?: number): DateTime {
            if (typeof value == "number") {
                let millis: Long = Long.fromNumber(value).multiply(scale); //+ (value >= 0? 0.5: -0.5);
            } else return this.AddTicks(value._ticks);
        }

        public AddSeconds(seconds: number): DateTime {
            return new DateTime();
        }

        public AddDays(value: number): DateTime {
            return this.Add(value, this.MillisPerDay);
        }
    }
}