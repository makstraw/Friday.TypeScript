window.location.GetParam = function (name) {
    var params = window.location.GetParams();
    var result = "";
    params.forEach(function (param) {
        if (param.Name == name)
            result = param.Value;
    });
    return result;
};
window.location.GetParamByIndex = function (index) {
    var params = window.location.GetParams();
    if (params.length > index) {
        return params[index].Value;
    }
    return "";
};
window.location.GetParams = function () {
    var result = [];
    var query = window.location.GetParamsQuery();
    if (query.IsEmpty())
        return result;
    query.split("&").forEach(function (value, index) {
        var pair = value.split("=");
        if (pair.length == 2) {
            result.push({ Name: pair[0], Value: pair[1] });
        }
        else if (pair.length == 1) {
            result.push({ Name: index.toString(), Value: pair[0] });
        }
    });
    return result;
};
window.location.GetParamsQuery = function () {
    var startIndex = window.location.href.search("\\?");
    if (startIndex == -1)
        return "";
    return window.location.href.substring(window.location.href.search("\\?") + 1);
};
//# sourceMappingURL=WindowLocationExtensions.js.map