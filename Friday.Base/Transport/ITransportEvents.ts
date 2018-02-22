///<reference path="../Utility/EventHandler.ts"/>
namespace Friday.Transport {
    import EventHandler = Utility.EventHandler;

    export interface ITransportEvents {
        OnOpen: EventHandler<void>;
        OnClose: EventHandler<CloseEvent>;
        OnError: EventHandler<ErrorEvent>;
        OnMessage: EventHandler<MessageEvent>;
    }
}