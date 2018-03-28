///<reference path="../../Friday.Base/Utility/ObjectComparison.ts"/>
///<reference path="../../Friday.Base/System/Interfaces/IEquatable.ts"/>
/// <reference path="../../Friday.Base/ValueObjects/LegacyDateTime.ts" />
interface KnockoutObservableArray<T> {
    RemoveDeleted(records: Array<T>): void;
    AddNew(records: Array<T>, unshift?: boolean): void;
    UpdateRecords(records: Array<T>, unshift?: boolean): void;
    InsertOrUpdate(newRecord: T | Friday.System.IEquatable<any>, objectPropertyName?: string, unshift?: boolean, ): void;
    FindRecord(matchRecord: T, objectPropertyName: string): object;
    FindRecordByProperty(propertyName: string, propertyValue: any): object | null;
    FindRecordIndex(matchRecord: T): number;
    FindRecordIndex(matchRecord: T, objectPropertyName: string): number;
    FindRecordIndex(matchRecord: Friday.System.IEquatable<any>): number;
    FindNext(currentRecord: any, objectPropertyName?: string): any;
    FindPrev(currentRecord: any, objectPropertyName?: string): any;
}

ko.observableArray.fn.FindRecord = function (this: KnockoutObservableArray<any>, matchRecord: any, objectPropertyName: string): object {
    var index = this.FindRecordIndex(matchRecord, objectPropertyName);
    if (index != null) return this()[index];
    return null;
}

ko.observableArray.fn.FindNext = function (this: KnockoutObservableArray<any>, currentRecord: any, objectPropertyName?: string): any {
    let index = this.FindRecordIndex(currentRecord, objectPropertyName);
    if (index === null) return null;
    for (let i=index+1;i<this().length;i++) {
        let nextItem = this()[i];
        if (typeof nextItem !== "undefined" && nextItem !== null) return nextItem;
    }
    return null;
}

ko.observableArray.fn.FindPrev = function (this: KnockoutObservableArray<any>, currentRecord: any, objectPropertyName?: string): any {
    let index = this.FindRecordIndex(currentRecord, objectPropertyName);
    if (index === null) return null;
    for (let i = index - 1; i >= 0; i--) {
        let prevItem = this()[i];
        if (typeof prevItem !== "undefined" && prevItem !== null) return prevItem;
    }
    return null;
}

ko.observableArray.fn.FindRecordByProperty = function(this: KnockoutObservableArray<any>,
    propertyName: string,
    propertyValue: any): object | null {
    for (let i = 0; i < this().length; i++) {
        if (typeof (this()[i]) !== "undefined" && this()[i][propertyName] == propertyValue) return this()[i];
    }
    return null;
}

ko.observableArray.fn.FindRecordIndex = function (this: KnockoutObservableArray<any>, matchRecord: any | Friday.System.IEquatable<any>, objectPropertyName?: string): number {
    for (let i = 0; i < this().length;i++) {
        var item = this()[i];
        if (item === matchRecord) return i;

        if (Friday.System.IsEquatable(item) && item.Equals(matchRecord)) return i;

        if(typeof objectPropertyName !== "undefined")
        if ((typeof item[objectPropertyName] == "object" &&
                compareObjects(item[objectPropertyName], matchRecord[objectPropertyName])) ||
            (typeof item[objectPropertyName] != "object" && item[objectPropertyName] == matchRecord[objectPropertyName])
        ) {
            return i;
        }
    }
    return null;
}

ko.observableArray.fn.InsertOrUpdate = function (this: KnockoutObservableArray<any>, newRecord: object | Friday.System.IEquatable<any>, objectPropertyName?: string, unshift?: boolean, ): void {
    if (!unshift) unshift = false;
    let itemIndex : number;

//    if (Friday.System.IsEquatable(newRecord) && (typeof objectPropertyName === "undefined" || objectPropertyName === null)) {
//        itemIndex = this.FindRecordIndex(newRecord);
//    }else
    itemIndex = this.FindRecordIndex(newRecord, objectPropertyName);

    if (itemIndex != null) {
        this().splice(itemIndex, 1, newRecord);
        this.notifySubscribers();
    } else {
        if (unshift) this.unshift(newRecord);
        else this.push(newRecord);
    }
}

ko.observableArray.fn.RemoveDeleted = function (this: KnockoutObservableArray<any>, records: Array<any>) {
    this().forEach(function (item: any) {
        if (!(<any>records).find(function(element: any): boolean {
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