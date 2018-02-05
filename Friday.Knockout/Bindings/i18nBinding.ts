///<reference path="../Definitions/knockout.d.ts"/>
///<reference path="../Definitions/jquery.d.ts"/>
///<reference path="../Definitions/jquery.i18n.d.ts"/>
ko.bindingHandlers.i18n = {
    init: function(element, valueAccessor) {

    },
    update: function(element, valueAccessor) {
        var value: string = $.i18n(<string>valueAccessor());
        $(element).text(value);
    }
}