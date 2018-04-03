interface Selector<TSource,TResult> {
    (arg: TSource): TResult;
}