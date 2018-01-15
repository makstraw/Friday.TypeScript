///<reference path="IHashResult.ts"/>
namespace Friday.Crypto.Hash {
    export interface IHashProvider {
        FromString(data: string): IHashResult;
        FromArrayBuffer(data: ArrayBuffer): IHashResult;
    }
}