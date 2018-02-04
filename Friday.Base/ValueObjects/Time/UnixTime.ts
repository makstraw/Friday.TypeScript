///<reference path="DateTime.ts"/>
namespace Friday.ValueTypes {
    export class UnixTime {
        public static readonly UnixEpochStart: DateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);

        public readonly SecondsInDay = 86400;

        public readonly TimeStamp: number;

        private constructor(timeStamp: number) {
            this.TimeStamp = timeStamp;
        }

        public static ToDateTime(unixTime: number): DateTime {
            return this.UnixEpochStart.AddSeconds(unixTime);
        }

        public AddDays(dayCount: number): UnixTime {
            return new UnixTime(this.TimeStamp + dayCount * this.SecondsInDay);
        }
    }
}