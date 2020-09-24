ko.bindingHandlers.i18n = {
    init: function (element, valueAccessor) {
        element.classList.add("i18n-ko");
    },
    update: function (element: HTMLElement, valueAccessor) {
        let output: string;
        let value = ko.unwrap(valueAccessor());
        if (typeof value === "undefined") {
            console.trace(value);
            return;
        }

        //Simple 'string'
        if (typeof value == "string") {
            output = $.i18n(value);
            $(element).text(output);
        } else {
            let paramless = true;

            if (typeof value.params === "string" || typeof value.params === "number") {
                output = $.i18n(value.key as string, value.params);
            }
            //key and array of params
            else if (typeof value.params == "object" && Array.isArray(value.params)) {
                output = $.i18n.apply(null, [value.key, ...value.params]);
            }
            //key only
            else if (typeof value.params == "undefined")
                output = $.i18n(value.key as string);

            //Apply to attribute
            if (typeof value.attr == "string") {
                $(element).attr(value.attr, output);
            } else { 
                //Apply to inner html
                if (typeof value.html == "boolean" && value.html === true) $(element).html(output);

                //Apply to inner text
                else $(element).text(output);
            }
        }
    }
}