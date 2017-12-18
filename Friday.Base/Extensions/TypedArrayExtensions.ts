interface Uint8Array {
    toUint32Le(): number;
    toUint32Be(): number;
}

Uint8Array.prototype.toUint32Be = function (): number {
    return this[3] + this[2] * 256 + this[1] * 256 * 256 + this[0] * 256 * 256 * 256;
}
Uint8Array.prototype.toUint32Le = function (): number {
    return this[0] + this[1] * 256 + this[2] * 256 * 256 + this[3] * 256 * 256 * 256;
}