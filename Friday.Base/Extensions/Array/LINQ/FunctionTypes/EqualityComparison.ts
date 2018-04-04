interface EqualityComparison<T> {
    (a: T, b: T, strict?: boolean): boolean;
}