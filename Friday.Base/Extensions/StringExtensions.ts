interface String {
    toUCFirst(): string;
    IsEmpty(): boolean;
    SplitWithRest(separator: string, limit: number): Array<string>;
}

interface StringConstructor {
    IsNullOrEmpty(value: string): boolean;
    Empty: string;
}

String.prototype.toUCFirst = function (): string {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

String.prototype.IsEmpty = function (): boolean {
    return this.length === 0;
};

String.IsNullOrEmpty = (value: string): boolean => value == null || value.IsEmpty();

String.Empty = "";

String.prototype.SplitWithRest = function (separator, limit) {
    let parts = this.split(separator);
    if (parts.length > limit) {
        let restString = parts.slice(limit).join(separator);
        return [...parts.slice(0, limit), restString];
    } else return parts;
};