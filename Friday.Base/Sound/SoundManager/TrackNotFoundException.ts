///<reference path="../../Exceptions/Basic/Exception.ts"/>
namespace Friday.Exceptions {   
    export class TrackNotFoundException extends Exception {
        constructor(name: string) {
            super(`Track '${name}' not found`);
        }
    }
}