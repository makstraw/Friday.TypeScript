///<reference path="IMessage.ts"/>
namespace Friday.Transport {
    export interface IMessageSend {
        sendMessage(message: IMessage): void;
    }
}