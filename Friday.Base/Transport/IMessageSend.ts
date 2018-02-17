///<reference path="IMessage.ts"/>
namespace Friday.Transport {
    export interface IMessageSend {
        SendMessage(message: IMessage): void;
    }
}