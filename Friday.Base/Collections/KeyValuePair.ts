namespace Friday.Collections {

    export enum KeyValuePairSerializationMode {
        Object,
        Key,
        Value
    }

    export class KeyValuePair<TKey, TValue> {
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