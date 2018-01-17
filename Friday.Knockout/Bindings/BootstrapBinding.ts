///<reference path="../Definitions/jquery.d.ts"/>
///<reference path="../Definitions/knockout.d.ts"/>
namespace Friday.Knockout {
    ko.bindingHandlers.showModal = {
        init(element, valueAccessor) {
            $(element).modal({
                show: false
            });

            var value = valueAccessor();
            if (ko.isObservable(value)) {
                $(element).on('hide.bs.modal',
                    () => {
                        value(false);
                    });
            }
        },
        update(element, valueAccessor) {
            var value = valueAccessor();
            if (ko.utils.unwrapObservable(value)) {
                $(element).modal('show');
            } else {
                $(element).modal('hide');
            }
        }
    };
}