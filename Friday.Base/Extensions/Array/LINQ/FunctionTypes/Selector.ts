interface Selector<TSource,TResult> {
    (source: TSource): TResult;
}