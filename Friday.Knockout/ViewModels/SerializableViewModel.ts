///<reference path="RoutedViewModel.ts"/>
///<reference path="../Extensions/ObservableExtension/Default.ts"/>
///<reference path="../Extensions/ObservableExtension/Serialize.ts"/>
///<reference path="../Types/Interfaces/IKnockoutSerializable.ts"/>

namespace Friday.Knockout.ViewModels {
    import IMessage = Friday.Transport.IMessage;
    import SerializationMode = Knockout.Types.SerializationMode;
    import SerializationFilter = Knockout.Types.SerializationFilter;
    import IKnockoutSerializable = Knockout.Types.IKnockoutSerializable;


    export abstract class SerializableViewModel extends RoutedViewModel implements IMessage, IKnockoutSerializable<any> {
        [index: string]: any;
        public abstract readonly MessageType: any;
        public readonly SerializationMode: SerializationMode = SerializationMode.Exclude;
        public readonly SerializationFilter: SerializationFilter = SerializationFilter.All;
        public readonly SerializationFields: Array<string> = [];

        public Clear() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && ko.isObservable(this[prop]) && typeof (<KnockoutObservable<any>>this[prop]).Reset === "function") {
                    (<KnockoutObservable<any>>this[prop]).Reset();
                }
            }
        }

        public ToDto(): IMessage {
            let dto = ko.ToDto(this);
            (dto as IMessage).MessageType = this.MessageType;
            return dto as IMessage;
        }

        public Submit() {
            this.sendMessage(this.ToDto());
        }
    }
}