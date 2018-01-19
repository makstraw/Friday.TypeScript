///<reference path="../../Friday.Base/Utility/ObjectComparison.ts"/>
interface KnockoutObservableArray<T> {
    RemoveDeleted(records: Array<T>): void;
    AddNew(records: Array<T>, unshift?: boolean): void;
    UpdateRecords(records: Array<T>, unshift?: boolean): void;
}

ko.observableArray.fn.RemoveDeleted = function (records: Array<any>) {
    this().forEach(function (item: any) {
        if (!records.find(function (element: any): boolean {
                if (typeof element == "object")
                    return compareObjects(this, element);
                else return this == element;
            },
            item)) {
            this.remove((i: any) => {return item.Equals(i)});
        };
    });
}

ko.observableArray.fn.AddNew = function (records: Array<any>, unshift?: boolean) {
    if (!unshift) unshift = false;

    records.forEach(function(item: any) {
        if(!this().find(function(element: any): boolean {
            if (typeof element == "object")
                return compareObjects(this, element);
            else return this == element;
        }, item)) {
            if (unshift) this.unshift(item);
            else this.push(item);
        }
    }, this);
}

ko.observableArray.fn.UpdateRecords = function (records: Array<any>, unshift?: boolean) {
    if (!unshift) unshift = false;

    this.RemoveDeleted(records);
    this.AddNew(records, unshift);
}