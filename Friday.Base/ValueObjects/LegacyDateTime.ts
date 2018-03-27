namespace Friday.ValueTypes {
    export class LegacyDateTime {
        public static FromCSharp(dateTime: string): Date {
            var tmpArray: Array<string>;
            tmpArray = dateTime.split("T");
            var dateArray = tmpArray[0].split("-");
            tmpArray = tmpArray[1].split("+");
            var gmt = tmpArray[1];
            tmpArray = tmpArray[0].split(".");
            var microSeconds = tmpArray[1];
            if (typeof(microSeconds) == "undefined") microSeconds = "0";
            var timeArray = tmpArray[0].split(":");
            return new Date(Number(dateArray[0]),
                Number(dateArray[1]),
                Number(dateArray[2]),
                Number(timeArray[0]),
                Number(timeArray[1]),
                Number(timeArray[2]),
                Number(microSeconds.substr(0, 3)));
            //2017 - 08 - 22T11: 00:38.4737957 + 03:00
        }
    }
}