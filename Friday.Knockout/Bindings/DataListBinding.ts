function getVal(rawItem, prop) {
    var item = ko.unwrap(rawItem);
    if (typeof prop === "function" && item !== null) return prop(item);
    return item && prop ? ko.unwrap(item[prop]) : item;
}

function findItem(options, prop, ref) {
    return ko.utils.arrayFirst(options,
        function (item) {         
            return ref === getVal(item, prop);
        });
}

function findItem2(valueAccessor, prop, ref) {
    return ko.utils.arrayFirst(valueAccessor().options,
        function (item) {
            return ref === getVal(item, prop);
        });
}

ko.bindingHandlers.datalist = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var setup = valueAccessor(),
            textProperty = ko.unwrap(setup.optionsText),
            valueProperty = ko.unwrap(setup.optionsValue),
            dataItems = ko.unwrap(setup.options),
            myValue = setup.value,
            koValue = allBindingsAccessor().value,
            datalist = document.createElement("DATALIST");

        // create an associated <datalist> element
        datalist.id = element.getAttribute("list");
        document.body.appendChild(datalist);

        // when the value is changed, write to the associated myValue observable
        function onNewValue(newVal) {
            var dataItems = ko.unwrap(setup.options),
                selectedItem = findItem2(valueAccessor, textProperty, newVal),
                newValue = selectedItem ? getVal(selectedItem, valueProperty) : void 0;
            if (ko.isWriteableObservable(myValue)) {
                myValue(newValue);
            }
        }

        // listen for value changes
        // - either via KO's value binding (preferred) or the change event
        if (ko.isSubscribable(koValue)) {
            koValue.subscribe(onNewValue);
        } else {
            ko.utils.registerEventHandler(element,
                "change",
                function () {
                    onNewValue(this.value);
                });
        }

        // init the element's value
        // - either via the myValue observable (preferred) or KO's value binding
        if (ko.isObservable(myValue) && myValue()) {
            element.value = getVal(findItem(dataItems, valueProperty, myValue()), textProperty);
        } else if (ko.isObservable(koValue) && koValue()) {
            onNewValue(koValue());
        }
    },
    update: function (element, valueAccessor, allBindings) {
        var setup = valueAccessor(),
            datalist = element.list,
            dataItems = ko.unwrap(setup.options),
            textProperty = ko.unwrap(setup.optionsText);


        // rebuild list of options when an underlying observable changes
        datalist.innerHTML = "";
        ko.utils.arrayForEach(dataItems,
            function (item) {
                var option = document.createElement("OPTION") as HTMLOptionElement;
                option.value = getVal(item, textProperty);
                datalist.appendChild(option);
            });
        ko.utils.triggerEvent(element, "change");
    }
}