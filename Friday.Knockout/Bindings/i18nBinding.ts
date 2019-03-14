ko.bindingHandlers.i18n = {
    init: function(element, valueAccessor) {

    },
    update: function (element, valueAccessor) {
        let output: string;
        let value = ko.unwrap(valueAccessor());
        if (typeof value === "undefined") {
            console.trace(value);
            return;
        }
        if (typeof value == "string") {
            output = $.i18n(value);
            $(element).text(output);
        }
        else {
            if (typeof value.params === "string" || typeof value.params === "number")
                output = $.i18n(value.key as string, value.params);
            else if (typeof value.params == "object" && Array.isArray(value.params)) {
                output = $.i18n.apply(null, [value.key, ...value.params]);
            }
            else if (typeof value.params == "undefined")
                output = $.i18n(value.key as string);

            if (typeof value.attr == "string") {
                $(element).attr(value.attr, output);
            } else {
                if (typeof value.html == "boolean" && value.html === true) $(element).html(output);
                else $(element).text(output);
            }
        }
    }
}