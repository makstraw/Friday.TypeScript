interface Array<T> {
    Distinct(compareSelector?: HashSelector<T>): Array<T>;
}

Array.prototype.Distinct = function (compareSelector?: HashSelector<any>): Array<any> {
    let output: Array<any> = [];
    this.forEach(row => {
        if (!output.Has(row)) output.push(row);
    });
    return output;
}