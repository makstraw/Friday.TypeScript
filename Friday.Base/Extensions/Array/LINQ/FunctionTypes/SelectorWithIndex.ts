interface SelectorWithIndex<TSource, TResult> {
    (source: TSource, index: number): TResult;
}