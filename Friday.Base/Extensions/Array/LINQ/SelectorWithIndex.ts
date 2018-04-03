interface SelectorWithIndex<TSource, TResult> {
    (arg: TSource, index: number): TResult;
}