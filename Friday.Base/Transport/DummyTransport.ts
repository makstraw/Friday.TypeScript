///<reference path="ITransport.ts"/>
namespace Friday.Transport {
    import EventHandler = Utility.EventHandler;

    export class DummyTransport implements ITransport{
        public SendMessage(message: IMessage): void {}
        public readonly OnOpen: EventHandler<void> = new EventHandler();
        public readonly OnClose: EventHandler<CloseEvent> = new EventHandler();
        public readonly OnError: EventHandler<ErrorEvent> = new EventHandler();
        public readonly OnMessage: EventHandler<MessageEvent> = new EventHandler();
    }
}