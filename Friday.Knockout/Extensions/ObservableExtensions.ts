interface KnockoutObservable<T> {
    Reset()
}

interface KnockoutExtenders {
    Default(value: any);
}

ko.observable.fn.Reset = function () {
    this(typeof this._default === 'function' ? this._default() : this._default);
}

ko.extenders.Default = function(value: any) {
    if (typeof value === 'undefined') return;
    this._default = value;

    if (typeof this() === 'undefined') {
        this.reset();
    }

    this.subscribe(function (newValue) {
        typeof newValue === 'undefined' && this.reset();
    });
}
