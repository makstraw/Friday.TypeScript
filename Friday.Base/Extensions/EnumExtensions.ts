class EnumEx {
    public static GetNamesAndValues<T extends number>(e: any): Array<Friday.Collections.KeyValuePair<number, string>> {
        return EnumEx.GetNames(e).map(n => (
            new Friday.Collections.KeyValuePair<number, string>(e[n] as T, n)
            //            { name: n, value: e[n] as T }
        ));
    }

    public static GetNames(e: any) {
        return EnumEx.getObjValues(e).filter(v => typeof v === "string") as string[];
    }

    public static GetValues<T extends number>(e: any) {
        return EnumEx.getObjValues(e).filter(v => typeof v === "number") as T[];
    }

    private static getObjValues(e: any): (number | string)[] {
        return Object.keys(e).map(k => e[k]);
    }
}