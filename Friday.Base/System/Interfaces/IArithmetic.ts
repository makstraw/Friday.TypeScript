///<reference path="IBasicArithmetic.ts"/>
namespace Friday.System {
    export interface IArithmetic<T> extends IBasicArithmetic<T>{
        Mul(value: T): T;
        Div(value: T): T;
    }
}