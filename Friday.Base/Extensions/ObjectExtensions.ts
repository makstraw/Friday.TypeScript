interface Object {
    Equals(compareTo: object): boolean;
}

Object.prototype.Equals = function (compareTo: object): boolean {
    var aProps = Object.getOwnPropertyNames(this);
    var bProps = Object.getOwnPropertyNames(compareTo);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (this[propName] !== compareTo[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
