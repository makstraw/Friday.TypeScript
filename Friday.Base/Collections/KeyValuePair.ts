﻿///<reference path="../System/Interfaces/IEquatable.ts" />
namespace Friday.Collections {
    import IEquatable = Friday.System.IEquatable;
    import IsEquatable = Friday.System.IsEquatable;


    export enum KeyValuePairSerializationMode {
        Object,
        Key,
        Value
    }

    export class KeyValuePair<TKey, TValue> implements IEquatable<KeyValuePair<TKey, TValue>> {
        public static SerializationMode: KeyValuePairSerializationMode = KeyValuePairSerializationMode.Object;

        public Key: TKey;
        public Value: TValue;

        constructor(key: TKey, value: TValue) {
            this.Key = key;
            this.Value = value;
        }

// ReSharper disable InconsistentNaming
        public toJSON(): any {
// ReSharper restore InconsistentNaming
            switch (KeyValuePair.SerializationMode) {
                case KeyValuePairSerializationMode.Object:
                    return this;
                case KeyValuePairSerializationMode.Key:
                    return this.Key;
                case KeyValuePairSerializationMode.Value:
                    return this.Value;


            }
        }

        public Equals(other: KeyValuePair<TKey, TValue>): boolean {
            if (IsEquatable(this.Key)) return (this.Key as any).Equals(other.Key);
            return this.Key === other.Key;
        }
    }
}


interface ArrayConstructor {
    Localize(inputArray: Array<Friday.Collections.KeyValuePair<any, any>>): void;
    GetKeys(inputArray: Array<Friday.Collections.KeyValuePair<any, any>>): Array<any>;
    GetValues(inputKvpArray: Array<Friday.Collections.KeyValuePair<any, any>>): Array<any>;
}

Array.Localize = (inputArray: Array<Friday.Collections.KeyValuePair<any, any>>): void => {
    for (let i = 0; i < inputArray.length; i++) inputArray[i].Value = $.i18n(inputArray[i].Value);
};

Array.GetKeys = (inputArray: Array<Friday.Collections.KeyValuePair<any, any>>): Array<any> => {
    let output: Array<any> = [];
    for (let i = 0; i < inputArray.length; i++) output.push(inputArray[i].Key);
    return output;
}

Array.GetValues = (inputArray: Array<Friday.Collections.KeyValuePair<any, any>>): Array<any> => {
    let output: Array<any> = [];
    for (let i = 0; i < inputArray.length; i++) output.push(inputArray[i].Value);
    return output;
}