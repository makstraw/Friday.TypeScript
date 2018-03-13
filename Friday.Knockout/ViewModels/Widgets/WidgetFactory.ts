/// <reference path="../../../Friday.Base/Reflection/INamespaceObject.ts" />
/// <reference path="../../../Friday.Base/Transport/ITransport.ts" />
/// <reference path="../../../Friday.Base/Transport/IPacketRegistryRouteRegistration.ts" />
namespace Friday.Knockout.ViewModels.Widgets {
    import INamespaceObject = Friday.Reflection.INamespaceObject;
    import ITransport = Friday.Transport.ITransport;
    import IPacketRegistryRouteRegistration = Friday.Transport.IPacketRegistryRouteRegistration;
    import DummyPacketRegistry = Friday.Transport.DummyPacketRegistry;

    export class WidgetFactory {
        private availableWidgets: Array<string> = [];
        private namespace: INamespaceObject<Widget>;
        private transport: ITransport;
        private registry: IPacketRegistryRouteRegistration;
        private dummyRegistry: IPacketRegistryRouteRegistration = new DummyPacketRegistry();

        constructor(widgetsNamespace: INamespaceObject<Widget>, transport: ITransport, registry: IPacketRegistryRouteRegistration) {
            this.namespace = widgetsNamespace;
            this.availableWidgets = Friday.Reflection.ScanNamespace(widgetsNamespace);
            this.transport = transport;
            this.registry = registry;
        }

        public GetWidget(name: string, options?: IWidgetOptions): Widget | null {
            if (this.availableWidgets.Has(name)) {
                let widget: Widget;
                if (options == null)
                    widget = (this.namespace[name] as any).FromDefault(this.transport, this.dummyRegistry) as Widget;
                else {
                    widget = new (this.namespace[name] as any)(options, this.transport, this.registry);
                }
                return widget;
            }
            return null;
        }

    }
}