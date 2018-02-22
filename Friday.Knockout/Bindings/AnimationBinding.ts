
    ko.bindingHandlers.toggleShow = {
        init: function(element, valueAccessor) {

        },
        update: function(element, valueAccessor) {
            var showMs = $(element).attr("data-show-ms");
            var hideMs = $(element).attr("data-hide-ms");

            var value = ko.unwrap(valueAccessor());
            if (value) {
                $(element).show(showMs);
            } else {
                $(element).hide(hideMs);
            }
        }
    }

    ko.bindingHandlers.toggleFade = {
        init: function(element, valueAccessor) {

        },
        update: function(element, valueAccessor) {
            var fadeInMs = $(element).attr("data-fadein-ms");
            var fadeOutMs = $(element).attr("data-fadeout-ms");

            var value = ko.unwrap(valueAccessor());
            if (value) {
                $(element).fadeIn(fadeInMs);
            } else {
                $(element).fadeOut(fadeOutMs, $(element).hide);
            }
        }
    }

    ko.bindingHandlers.toggleSlide = {
        init: function(element, valueAccessor) {

        },
        update: function(element, valueAccessor) {
            var slideUpMs = $(element).attr("data-slideup-ms");
            var slideDownMs = $(element).attr("data-slidedown-ms");

            var value = ko.unwrap(valueAccessor());
            if (value) {
                $(element).slideDown(slideDownMs);
            } else {
                $(element).slideUp(slideUpMs);
            }
        }
    }