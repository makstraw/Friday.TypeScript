///<reference path="../../Friday.Base/Utility/ObjectComparison.ts"/>
interface KnockoutObservableArray<T> {
    RemoveDeleted(records: Array<T>): void;
    AddNew(records: Array<T>, unshift?: boolean): void;
    UpdateRecords(records: Array<T>, unshift?: boolean): void;
    InsertOrUpdate(newRecord: T, objectPropertyName: string, unshift?: boolean, ): void;
    FindRecord(matchRecord: T, objectPropertyName: string): object;
    FindRecordByProperty(propertyName: string, propertyValue: any): object;
    FindRecordIndex(matchRecord: T, objectPropertyName: string): number;
}

ko.observableArray.fn.FindRecord = function (this: KnockoutObservableArray<any>, matchRecord: any, objectPropertyName: string): object {
    var index = this.FindRecordIndex(matchRecord, objectPropertyName);
    if (index != null) return this()[index];
    return null;
}

ko.observableArray.fn.FindRecordByProperty = function(this: KnockoutObservableArray<any>,
    propertyName: string,
    propertyValue: any): object {
    for (let i = 0; i < this().length; i++) {
        if (this()[i][propertyName] == propertyValue) return this()[i];
    }
    return null;
}

ko.observableArray.fn.FindRecordIndex = function (this: KnockoutObservableArray<any>, matchRecord: any, objectPropertyName: string): number {
    for (let i = 0; i < this().length;i++) {
        var item = this()[i];
        if ((typeof item[objectPropertyName] == "object" &&
                compareObjects(item[objectPropertyName], matchRecord[objectPropertyName])) ||
            (typeof item[objectPropertyName] != "object" && item[objectPropertyName] == matchRecord[objectPropertyName])
        ) {
            return i;
        }
    }
    return null;
}

ko.observableArray.fn.InsertOrUpdate = function (this: KnockoutObservableArray<any>, newRecord: object, objectPropertyName: string, unshift?: boolean, ): void {
    if (!unshift) unshift = false;
    var itemIndex = this.FindRecordIndex(newRecord, objectPropertyName);
    if (itemIndex != null) {
        this().splice(itemIndex, 1, newRecord);
        console.log(this());
        this.notifySubscribers();
    } else {
        if (unshift) this.unshift(newRecord);
        else this.push(newRecord);
    }
}

ko.observableArray.fn.RemoveDeleted = function (this: KnockoutObservableArray<any>, records: Array<any>) {
    this().forEach(function (item: any) {
        if (!records.find(function(element: any): boolean {
                if (typeof element == "object")
                    return compareObjects(this, element);
                else return this == element;
            },
            item)) {
            this.remove((i: any) => { return compareObjects(item, i) });
        };
    },this);
}

ko.observableArray.fn.AddNew = function (this: KnockoutObservableArray<any>, records: Array<any>, unshift?: boolean) {
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

ko.observableArray.fn.UpdateRecords = function (this: KnockoutObservableArray<any>, records: Array<any>, unshift?: boolean) {
    if (!unshift) unshift = false;

    this.RemoveDeleted(records);
    this.AddNew(records, unshift);
}