///<reference path="Except.ts"/>
///<reference path="Select.ts"/>
///<reference path="Where.ts"/>

interface Array<T> {
    Count(predictate?: Predictate<T> | PredictateWithIndex<T>): number;

}