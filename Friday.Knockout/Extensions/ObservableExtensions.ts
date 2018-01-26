interface KnockoutObservable<T> {
    Reset()
}

interface KnockoutExtenders {
    Default(target: any, value?: any);
}

ko.observable.fn.Reset = function () {
    this(typeof this._default === 'function' ? this._default() : this._default);
}

ko.extenders.Default = (target: any, value?: any) => {
    if (typeof value === 'undefined') target._default = target();
    else target._default = value;

    target.subscribe(function (newValue) {
        typeof newValue === 'undefined' && this.reset();
    });
}
