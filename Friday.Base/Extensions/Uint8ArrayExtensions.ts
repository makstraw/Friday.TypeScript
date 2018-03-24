interface Uint8Array {
    IndexOfSequence(searchElements: Uint8Array, fromIndex?: number): number;
}

Uint8Array.prototype.IndexOfSequence = function (this: Uint8Array, searchElements: Uint8Array, fromIndex?: number): number {
    fromIndex = fromIndex || 0;

    var index = Array.prototype.indexOf.call(this, searchElements[0], fromIndex);
    if (searchElements.length === 1 || index === -1) {
        // Not found or no other elements to check
        return index;
    }

    for (var i = index, j = 0; j < searchElements.length && i < this.length; i++ , j++) {
        if (this[i] !== searchElements[j]) {
            return this.IndexOfSequence(searchElements, index + 1);
        }
    }

    return (i === index + searchElements.length) ? index : -1;
};