Number.prototype.toFixedFloor = function (fractionDigits) {
    var tmp = this * Math.pow(10, fractionDigits);
    var tmp = Math.floor(tmp);
    return (tmp / Math.pow(10, fractionDigits)).toString();
};
Number.prototype.toFixedRoundUpLow = function (fractionDigits) {
    var tmp = this * Math.pow(10, fractionDigits);
    var tmp = Math.floor(tmp);
    if (tmp == 0 && this != 0)
        tmp = 1;
    return (tmp / Math.pow(10, fractionDigits)).toString();
};
//# sourceMappingURL=NumberExtensions.js.map