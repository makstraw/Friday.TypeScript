var AtsLibKnockout;
(function (AtsLibKnockout) {
    ko.bindingHandlers.i18n = {
        init: function (element, valueAccessor) {
        },
        update: function (element, valueAccessor) {
            var value = $.i18n(valueAccessor());
            $(element).text(value);
        }
    };
})(AtsLibKnockout || (AtsLibKnockout = {}));
//# sourceMappingURL=i18nBinding.js.map