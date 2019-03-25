interface String {
    toUCFirst(): string;
    SplitWithRest(separator: string, limit: number): Array<string>;
    readonly IsEmpty: boolean;
}

interface StringConstructor {
    IsNullOrEmpty(value: string): boolean;
    Empty: string;
}

String.prototype.toUCFirst = function (): string {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};


Object.defineProperty(String.prototype,
    "IsEmpty",
    {
        get: function IsEmpty(): boolean {
            return this.length === 0;
        },
        set: () => undefined,
        enumerable: true
    });

String.IsNullOrEmpty = (value: string): boolean => value == null || value.IsEmpty;

String.Empty = "";

String.prototype.SplitWithRest = function (separator, limit) {
    let parts = this.split(separator);
    if (parts.length > limit) {
        let restString = parts.slice(limit).join(separator);
        return [...parts.slice(0, limit), restString];
    } else return parts;
};