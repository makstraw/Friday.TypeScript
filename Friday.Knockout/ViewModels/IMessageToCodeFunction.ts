/// <reference path="../../Friday.Base/Transport/IMessage.ts" />
namespace Friday.Knockout.ViewModels {
    import IMessage = Transport.IMessage;

    export interface IMessageToCodeFunction {
        (message: IMessage): number;
    }
}