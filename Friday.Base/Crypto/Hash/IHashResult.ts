namespace Friday.Crypto.Hash {
    export interface IHashResult {
        ToHexString() : string;
        ToBinaryString() : string;
        ToArrayBuffer() : ArrayBuffer;
    }
}