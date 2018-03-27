namespace Friday.System {
    export interface IBasicArithmetic<T> {
        Add(value: T): T;
        Sub(value: T): T;
    }
}