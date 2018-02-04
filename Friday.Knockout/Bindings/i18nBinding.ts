ko.bindingHandlers.i18n = {
    init(element, valueAccessor) {

    },
    update(element, valueAccessor) {
        var value: string = $.i18n(<string>valueAccessor());
        $(element).text(value);
    }
}