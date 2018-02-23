///<reference path="RoutedViewModel.ts"/>
///<reference path="../Extensions/ObservableExtension/Default.ts"/>
///<reference path="../Extensions/ObservableExtension/Serialize.ts"/>

namespace Friday.Knockout.ViewModels {
    import IMessage = Friday.Transport.IMessage;

    export enum SerializationMode {
        Include,
        Exclude
    }

    export enum SerializationFilter {
        All,
        ObservablesOnly,
        PrimitivesOnly
    }

    export abstract class SerializableViewModel extends RoutedViewModel implements IMessage {
        [index: string]: any;
        public abstract readonly MessageType: any;
        public readonly SerializationMode: SerializationMode = SerializationMode.Exclude;
        public readonly SerializationFilter: SerializationFilter = SerializationFilter.All;

        public Clear() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && ko.isObservable(this[prop])) {
                    (<KnockoutObservable<any>>this[prop]).Reset();
                }
            }
        }

//        protected toDto(): object {
//            return ko.toJS(this);
//        }

        public Submit() {
            let dto = ko.ToDto(this);
            (dto as any).MessageType = this.MessageType;
            this.sendMessage(dto);
        }
    }
}