interface KnockoutObservable<T> {
    Reset(): void;
}

interface KnockoutExtenders {
    Default(target: any, value?: any): any;
}

ko.observable.fn.Reset = function () {
    this(typeof this._default === 'function' ? this._default() : this._default);
}

ko.extenders.Default = function(target: any, value?: any) {
    if (typeof value === 'undefined') target._default = target();
    else target._default = value;

    target.subscribe(function (newValue: any) {        
        typeof newValue === 'undefined' && this.Reset();
    }.bind(target));
}
