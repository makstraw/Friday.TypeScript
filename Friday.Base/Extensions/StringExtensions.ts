interface String {
    toUCFirst(): string;
    IsEmpty(): boolean;
}

String.prototype.toUCFirst = function (): string {
    return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
};

String.prototype.IsEmpty = function (): boolean {
    return this.length == 0;
};