interface IQueryParam {
    Name: string;
    Value: string;
}

interface Location {
    GetParamByIndex(index: number): string;
    GetParam(name: string): string;
    GetParams(): Array<IQueryParam>;
    GetParamsQuery(): string;
}


window.location.GetParam = (name: string): string => {
    var params = window.location.GetParams();
    let result = "";
    params.forEach((param: IQueryParam) => {
        if (param.Name == name) result = param.Value;
    });
    return result;
}

window.location.GetParamByIndex = (index: number): string => {
    var params = window.location.GetParams();
    if (params.length > index) {
        return params[index].Value;
    }
    return "";
}

window.location.GetParams = (): Array<IQueryParam> => {
    let result: Array<IQueryParam> = [];

    let query = window.location.GetParamsQuery();
    if (query.IsEmpty()) return result;

    query.split("&").forEach((value: string, index: number) => {
        var pair = value.split("=");
        if (pair.length == 2) {
            result.push({ Name: pair[0], Value: pair[1] });
        }else if (pair.length == 1) {
            result.push({ Name: index.toString(), Value: pair[0] });
        }
    });
    return result;
}

window.location.GetParamsQuery = (): string => {
    let startIndex = window.location.href.search("\\?");
    if (startIndex == -1) return "";
    return window.location.href.substring(window.location.href.search("\\?")+1);
}