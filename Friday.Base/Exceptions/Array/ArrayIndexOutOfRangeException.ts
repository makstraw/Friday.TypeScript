namespace  Friday.Exceptions {
    export class ArrayIndexOutOfRangeException extends Exception {
        constructor(array: Array<any>, index: number) {
            super("Index '" + index + "' out of range of array with length: "+ Array.length);
        }
    }
}