///<reference path="../System/Interfaces/ISerializable.ts"/>
///<reference path="../Collections/KeyValuePair.ts"/>
namespace Friday.System {
    import KeyValuePair = Collections.KeyValuePair;

    export class RequestId implements System.ISerializable<number> {
        private id: number;
        private static readonly maxUint32Value = 0xFFFFFFFF;
        private static readonly maxInt32Value = 0x7FFFFFFF;

        private static readonly callBackRegistry : Array<KeyValuePair<number,Function>> = [];

        
        
        constructor(callBackFn?: Function);
        constructor(id?: number, callBackFn?: Function);
        constructor(x?: number | Function, callBackFn?: Function) {
            if (typeof x !== "number") this.id = this.generate();
            else this.id = x;

            if (typeof x === "function") {
                callBackFn = x;
            }

            
            if (typeof callBackFn === "function") {
                RequestId.callBackRegistry.push(new KeyValuePair<number, Function>(this.id, function(this: RequestId) { callBackFn(); this.id = this.generate() }.bind(this)));
            }
        }
        

        private generate(): number {
            return Math.floor(Math.random() * RequestId.maxInt32Value);
        }

        public ToDto(): number {
            return this.id;
        }

        public MatchResponse(id: number) {
            return this.id === id;
        }
    }
}