///<reference path="StringExtensions.ts"/>
interface IQueryParam {
    Name: string;
    Value: string;
}

interface Location {
    GetParamByIndex(index: number): string;
    GetParam(name: string): string;
    GetParams(): Array<IQueryParam>;
    GetParamsQuery(): string;
    DefaultPort: boolean;
    RootUrl: string;
}


window.location.GetParam = (name: string): string => {
    var params = window.location.GetParams();
    let result = String.Empty;
    params.forEach((param: IQueryParam) => {
        if (param.Name === name) result = param.Value;
    });
    return result;
}

window.location.GetParamByIndex = (index: number): string => {
    var params = window.location.GetParams();
    if (params.length > index) {
        return params[index].Value;
    }
    return String.Empty;
}

window.location.GetParams = (): Array<IQueryParam> => {
    let result: Array<IQueryParam> = [];

    let query = window.location.GetParamsQuery();
    if (query.IsEmpty) return result;

    query.split("&").forEach((value: string, index: number) => {
        var pair = value.split("=");
        if (pair.length === 2) {
            result.push({ Name: pair[0], Value: pair[1] });
        }else if (pair.length == 1) {
            result.push({ Name: index.toString(), Value: pair[0] });
        }
    });
    return result;
}

window.location.GetParamsQuery = (): string => {
    let startIndex = window.location.href.search("\\?");
    if (startIndex === -1) return String.Empty;
    return window.location.href.substring(window.location.href.search("\\?")+1);
}

Object.defineProperty(window.location,
        "DefaultPort",
        {
            get: function DefaultPort(): boolean {
                return (this.protocol === "http:" && this.port === 80) ||
                    (this.protocol === "https:" && this.port === 443);
            },
            set: () => undefined,
            enumerable: true
    });

Object.defineProperty(window.location,
    "RootUrl",
    {
        get: function RootUrl(): string {
            let url = `${window.location.protocol}//${window.location.hostname}`;
            if (!window.location.DefaultPort) url += `:${window.location.port}`;            
            return url;
        },
        set: () => undefined,
        enumerable: true
    });