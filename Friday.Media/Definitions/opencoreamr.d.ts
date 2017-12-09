declare namespace opencoreamr {
    export type dataType = "i1" | "i8" | "i16" | "i32" | "i64" | "float" | "double";
    export var ALLOC_NORMAL: number;
    export var ALLOC_STACK: number;
    export var ALLOC_STATIC: number;
    export function Decoder_Interface_init(): any;
    export function allocate(slab: number, types: dataType, allocator: number): any;
    export function Decoder_Interface_Decode($state: any, $in: any, $out: any, $bfi: any): any;
    export function Decoder_Interface_exit($state: any): void;
    export function getValue(ptr: any, type: any, noSafe?: any): any;
    export function setValue(ptr: any, value: any, type: any, noSafe?: any): void;
}