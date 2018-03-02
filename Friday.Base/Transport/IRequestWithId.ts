/// <reference path="../ValueObjects/RequestId.ts" />
namespace Friday.Transport {
    import RequestId = ValueTypes.RequestId;

    export interface IServerResponseWithId {
        ResponseId: number;
    }

    export interface IClientRequestWithId {
        RequestId: RequestId;
    }
}