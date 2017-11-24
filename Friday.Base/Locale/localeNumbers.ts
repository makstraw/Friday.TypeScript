function getLocaleDelimiter() : string {
    var n: number = 1.1;
    return n.toLocaleString().substring(1, 2);
}