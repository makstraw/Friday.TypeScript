namespace Friday.ValueTypes {
    import NotImplementedException = Exceptions.NotImplementedException;

    export class TimeSpan {
        public _ticks: Long;
        public static TimeToTicks(hour, minute, second): Long {
            throw new NotImplementedException('TimeToTicks');
        }
    }
}