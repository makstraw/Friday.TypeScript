///<reference path="SerializableViewModel.ts"/>
///<reference path="Notices/NoticeViewModel.ts"/>
namespace Friday.Knockout.ViewModels {
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;
    import IMessageSend = Transport.IMessageSend;
    import NoticeViewModel = Knockout.ViewModels.Notices.NoticeViewModel;

    export abstract class ModalViewModel extends SerializableViewModel {
        public ErrorText: KnockoutObservable<string> = ko.observable("");
        public ShowModal: KnockoutObservable<boolean> = ko.observable(false);

        private static modalContext: Array<ModalViewModel> = [];

        constructor(transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport,registry);
            ModalViewModel.modalContext.push(this);
        }

        public static HideAll() {
            for (let i = 0; i < ModalViewModel.modalContext.length; i++) {
                ModalViewModel.modalContext[i].ShowModal(false);
            }
        }

        public ViewModelError(notice: NoticeViewModel) {
            this.ErrorText(notice.Description);
        }

        public Clear() {
            super.Clear();
            this.ErrorText("");
            this.ShowModal(false);
        }

        public ConditionalShow(condition: boolean, redirect: ModalViewModel) {
            if (condition) this.Show();
            else redirect.Show();
        }

        public Show() {
            this.Clear();
            ModalViewModel.HideAll();
            this.ShowModal(true);
        }
    }
}