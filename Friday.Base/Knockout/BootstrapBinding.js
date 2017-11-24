///<reference path="../Definitions/jquery.d.ts"/>
///<reference path="../Definitions/knockout.d.ts"/>
var AtsLibKnockout;
(function (AtsLibKnockout) {
    ko.bindingHandlers.showModal = {
        init: function (element, valueAccessor) {
            $(element).modal({
                show: false
            });
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                $(element).on('hide.bs.modal', function () {
                    value(false);
                });
            }
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.utils.unwrapObservable(value)) {
                $(element).modal('show');
            }
            else {
                $(element).modal('hide');
            }
        }
    };
})(AtsLibKnockout || (AtsLibKnockout = {}));
//# sourceMappingURL=BootstrapBinding.js.map