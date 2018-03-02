///<reference path="DateTime.ts"/>
///<reference path="../../Extensions/StringExtensions.ts"/>
///<reference path="../IComparable.ts"/>
namespace Friday.ValueTypes {
    import NotImplementedException = Exceptions.NotImplementedException;

    export interface IFormatProvider {
        
    }

    export interface DateTime {
        ToUnixTime(): UnixTime;
        ToTimestamp(): number;
    }

    DateTime.prototype.ToUnixTime = function (this: DateTime) : UnixTime {
        let timeStamp = this.Subtract(UnixTime.UnixEpochStart).TotalSeconds;
        return UnixTime.FromTimeStampSeconds(Long.fromNumber(timeStamp));
    };

    DateTime.prototype.ToTimestamp = function (this: DateTime) : number {
        return this.ToUnixTime().TimeStamp.toNumber();
    };

    export class UnixTime implements IComparable<UnixTime> {
        

        public static get Now(): UnixTime {
            return DateTime.UtcNow.ToUnixTime();
        }

        public static readonly UnixEpochStart: DateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        public static readonly EpochStart: UnixTime = UnixTime.UnixEpochStart.ToUnixTime();
        public static readonly EpochEnd: UnixTime = UnixTime.FromTimeStampSeconds(Long.fromNumber(2147483647));

        public static readonly CryptoCurrenciesEpochStartDateTime: DateTime = new DateTime(2018, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        public static readonly CryptoCurrenciesEpochStart: UnixTime = UnixTime.CryptoCurrenciesEpochStartDateTime.ToUnixTime();

        public readonly SecondsInDay = 86400;


        public toString(): string {
            return this.ToUtcTimeString();
        }

        public readonly TimeStamp: Long;

        public static FromTimeStampMs(timeStamp: Long): UnixTime{
            var seconds = timeStamp.div(1000);
            return new UnixTime(seconds);
        }

        public ToUtcTimeString(): string {
            throw new NotImplementedException('ToUtcTimeString');
        }

        public ToLocalTimeString(): string {
            throw new NotImplementedException('ToLocalTimeString');
        }

        public ToString(format: string, provider: IFormatProvider) {
            if (String.IsNullOrEmpty(format)) format = "U";
            let localPrefix = DateTimeKind[DateTimeKind.Local];
            let utcPrefix = DateTimeKind[DateTimeKind.Utc];
            let formattedTime = String.Empty();
            let dateTime = this.ToDateTime();

            switch (format) {
                case "L":
                    formattedTime = localPrefix + " Time: " + dateTime.ToLocalTime();
                    break;
                case "U":
                    formattedTime = utcPrefix + " Time: " + dateTime;
                    break;
            }
            return formattedTime;
        }

        public static FromTimeStampSeconds(timeStamp: Long): UnixTime {
            return new UnixTime(timeStamp);
        }


        private constructor(timeStamp: Long) {
            this.TimeStamp = timeStamp;
        }

//        public static ToDateTime(unixTime: Long): DateTime {
//            return this.UnixEpochStart.AddSeconds(unixTime.toNumber());
//        }

        public ToDateTime(): DateTime {
            return UnixTime.UnixEpochStart.AddSeconds(this.TimeStamp.toNumber());
        }

        public CompareTo(other: UnixTime): number {
            if (this.TimeStamp.lessThan(other.TimeStamp)) return -1;
            if (this.TimeStamp.greaterThan(other.TimeStamp)) return 1;
            return 0;
        }

//        public static Equals(t1: UnixTime, t2: UnixTime): boolean {
//            return t1.TimeStamp.equals(t2.TimeStamp);
//        }

        public Equals(other: UnixTime): boolean {
            return this.TimeStamp.equals(other.TimeStamp);
//            return UnixTime.Equals(this, other);
        }

        public GreaterThan(other: UnixTime): boolean {
            return this.TimeStamp.greaterThan(other.TimeStamp);
        }

        public LessThan(other: UnixTime): boolean {
            return this.TimeStamp.lessThan(other.TimeStamp);
        }

        public GreaterThanOrEqual(other: UnixTime): boolean {
            return this.TimeStamp.greaterThanOrEqual(other.TimeStamp);
        }

        public LessThanOrEqual(other: UnixTime): boolean {
            return this.TimeStamp.lessThanOrEqual(other.TimeStamp);
        }

        public Subtract(other: UnixTime): UnixTime {
            return new UnixTime(this.TimeStamp.sub(other.TimeStamp));
        }

        public Add(other: UnixTime): UnixTime {
            return new UnixTime(this.TimeStamp.add(other.TimeStamp));
        }

        public AddDays(dayCount: number): UnixTime {
            return new UnixTime(this.TimeStamp.add(Long.fromNumber(dayCount).mul(this.SecondsInDay)));
        }

        public static FromDto(dto): UnixTime {
            return new UnixTime(Long.fromNumber(dto.TimeStamp));
        }
    }


}