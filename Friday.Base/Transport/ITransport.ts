///<reference path="ITransportEvents.ts"/>
///<reference path="IMessageSend.ts"/>
namespace Friday.Transport {

    export interface ITransport extends ITransportEvents, IMessageSend {

    }
}