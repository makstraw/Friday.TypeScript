interface String {
    toUCFirst(): string;
    IsEmpty(): boolean;
}

interface StringConstructor {
    IsNullOrEmpty(value: string): boolean;
    Empty: string;
}

String.prototype.toUCFirst = function (): string {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

String.prototype.IsEmpty = function (): boolean {
    return this.length == 0;
};

String.IsNullOrEmpty = (value: string): boolean => value == null || value.IsEmpty();

String.Empty = "";