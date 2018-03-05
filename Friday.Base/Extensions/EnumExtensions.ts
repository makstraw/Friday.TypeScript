class EnumEx {
    public static GetNamesAndValues<T extends number>(e: any, skipFirst=1): Array<Friday.Collections.KeyValuePair<number, string>> {
        return EnumEx.GetNames(e, skipFirst).map(n => (
            new Friday.Collections.KeyValuePair<number, string>(e[n] as T, n)
            //            { name: n, value: e[n] as T }
        ));
    }

    public static GetNames(e: any, skipFirst = 1) {
        let output = EnumEx.getObjValues(e).filter(v => typeof v === "string") as string[];
        if (skipFirst > 0) output.splice(0, skipFirst);
        return output;
    }

    public static GetValues<T extends number>(e: any, skipFirst = 1) {
        let output = EnumEx.getObjValues(e).filter(v => typeof v === "number") as T[];
        if (skipFirst > 0) output.splice(0, skipFirst);
        return output;
    }

    private static getObjValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}