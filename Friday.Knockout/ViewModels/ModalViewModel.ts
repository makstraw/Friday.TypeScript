///<reference path="SerializableViewModel.ts"/>
///<reference path="Notices/NoticeViewModel.ts"/>
///<reference path="../../Friday.Base/Extensions/StringExtensions.ts"/>
///<reference path="../Exceptions/ExceptionToNoticeTransformationFunctionNotAssigned.ts"/>
///<reference path="IMessageToNoticeTransformationFunction.ts"/>
///<reference path="IMessageToCodeFunction.ts"/>
namespace Friday.Knockout.ViewModels {
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;
    import IMessageSend = Transport.IMessageSend;
    import NoticeViewModel = Knockout.ViewModels.Notices.NoticeViewModel;
    import IMessage = Friday.Transport.IMessage;
    import ExceptionToNoticeTransformationFunctionNotAssigned =
        Exceptions.ExceptionToNoticeTransformationFunctionNotAssigned;
    import NoticeSeverity = Knockout.ViewModels.Notices.NoticeSeverity;
    import SerializationMode = Knockout.Types.SerializationMode;

    export abstract class ModalViewModel extends SerializableViewModel {
        public ErrorText: KnockoutObservable<string> = ko.observable(String.Empty).extend({ Serialize: { Mode: SerializationMode.Exclude } });
        public ShowModal: KnockoutObservable<boolean> = ko.observable(false).extend({ Serialize: { Mode: SerializationMode.Exclude } });

        private static modalContext: Array<ModalViewModel> = [];
        private static messageToNotice: IMessageToNoticeTransformationFunction;
        private static messageToCode: IMessageToCodeFunction;

        private noticeRoutes: Array<number> = [];

        protected closeOnSuccess: boolean = true;

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
            this.ErrorText(String.Empty);
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

        public Hide() {
            this.ShowModal(false);
        }

        public Toggle() {
            if (this.ShowModal()) this.Hide();
            else this.Show();
        }

        public HandleExceptionMessage(message: IMessage) {
            if (typeof ModalViewModel.messageToNotice !== "function")
                throw new ExceptionToNoticeTransformationFunctionNotAssigned();
            let notice = ModalViewModel.messageToNotice(message);
            let code = ModalViewModel.messageToCode(message);

            if (this.closeOnSuccess && notice.Severity === NoticeSeverity.Success) {
                this.ShowModal(false);
//                return true;
            }

            if (this.noticeRoutes.Has(code)) {
                this.ViewModelError(notice);
//                return true;
            }
//            return false;
        }

        protected registerNoticeRoutes(...args: Array<number>) {
            this.noticeRoutes = args;
        }

        public static RegisterMessageToNoticeFunction(func: IMessageToNoticeTransformationFunction) {
            this.messageToNotice = func;
        }

        public static RegisterMessageToCodeFunction(func: IMessageToCodeFunction) {
            this.messageToCode = func;

        }
    }
}