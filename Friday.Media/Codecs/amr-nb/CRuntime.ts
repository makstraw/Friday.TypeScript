module Friday.C2Js {
    export class CRuntime {
        public static INT_TYPES: { "i1": 0; "i8": 0; "i16": 0; "i32": 0; "i64": 0 }
        public static FLOAT_TYPES: { "float": 0; "double": 0 }

        public StackSave() {
             
        }

        public StackRestore() {
     
        }
         
        public ForceAlign(target, quantum) {
//            quantum = quantum || 4;
//            if (quantum == 1) return target;
//            if (isNumber(target) && isNumber(quantum)) {
//                return Math.ceil(target / quantum) * quantum;
//            } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
//                var logg = Math.log2(quantum);
//                return '((((' + target + ')+' + (quantum - 1) + ')>>' + logg + ')<<' + logg + ')';
//            }
//            return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
        }

        public IsNumberType(value) : boolean {
            return value in CRuntime.INT_TYPES || value in CRuntime.FLOAT_TYPES;
        }
        
        public IsPointerType(value) : boolean {
            return value[value.length - 1] == '*';
        }

        public IsStructType(value) : boolean {
            if (this.IsPointerType(value)) return false;
            if (/^\[\d+\ x\ (.*)\]/.test(value)) return true; // [15 x ?] blocks. Like structs
            if (/<?{ [^}]* }>?/.test(value)) return true; // { i32, i8 } etc. - anonymous struct types
            // See comment in isStructPointerType()
            return value[0] == '%';
        }
    }
}