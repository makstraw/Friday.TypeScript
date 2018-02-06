ko.bindingHandlers.i18n = {
    init: function(element, valueAccessor) {

    },
    update: function(element, valueAccessor) {
        var value: string = $.i18n(<string>valueAccessor());
        $(element).text(value);
    }
}