///<reference path="../../../Friday.Base/Reflection/INamespaceObject.ts"/>
///<reference path="../../../Friday.Base/Transport/ITransport.ts"/>
namespace Friday.Knockout.ViewModels.Widgets {
    import ITransport = Friday.Transport.ITransport;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import INamespaceObject = Friday.Reflection.INamespaceObject;

    export interface IDashboardConfiguration {
        HorizontalGridStepPx: number;
        VerticalGridStepPx?: number;
        Transport: ITransport;
        Registry: IPacketRegistryRouteRegistration;
        Namespace: INamespaceObject<Widget>;
    }
}