namespace Friday.Exceptions {

    export class ArrayItemNotFoundException extends Exception {
        constructor(item: any) {
            super("Item '" + item + "' not found");
        }
    }
}