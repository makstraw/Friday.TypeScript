/// <reference path="../../Friday.Base/Transport/IMessage.ts" />
namespace Friday.Knockout.ViewModels {
    import NoticeViewModel = Knockout.ViewModels.Notices.NoticeViewModel;
    import IMessage = Transport.IMessage;

    export interface IMessageToNoticeTransformationFunction {
        (message: IMessage): NoticeViewModel;
    }
}