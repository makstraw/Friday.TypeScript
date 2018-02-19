///<reference path="RoutedViewModel.ts"/>
///<reference path="../Extensions/ObservableExtensions.ts"/>

namespace Friday.Knockout.ViewModels {
    import IMessage = Friday.Transport.IMessage;

    export abstract class SerializableViewModel extends RoutedViewModel implements IMessage {
        public abstract readonly MessageType: any;

        public Clear() {
            for (var prop in this) {
                if (this.hasOwnProperty(prop) && ko.isObservable(this[prop])) {
                    (<KnockoutObservable<any>>this[prop]).Reset();
                }
            }
        }

        protected toDto(): object {
            return ko.toJS(this);
        }

        public Submit() {
            let dto = this.toDto();
            (dto as any).MessageType = this.MessageType;
            this.sendMessage(dto);
        }
    }
}