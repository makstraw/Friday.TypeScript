function compareObjects(objectA: any, objectB: any): boolean {
    var aProps = Object.getOwnPropertyNames(objectA);
    var bProps = Object.getOwnPropertyNames(objectB);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (objectA[propName] !== objectB[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}