///<reference path="ModalViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    export abstract class ReadOnlyModalViewModel extends ModalViewModel {
        public MessageType: any = null;
        public Submit(): void {}

        protected toDto(): object { return null }
    }
}