interface Comparison<T> {
    (a: T, b: T, strict?: boolean): number;
}