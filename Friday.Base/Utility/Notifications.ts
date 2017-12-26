namespace Friday.Notifications {

    type NotificationPermission = "default" | "denied" | "granted";

    interface IFixedNotificationDeclaration extends Notification {
        readonly permission: NotificationPermission;
    }

    export class NotificationsApiWrapper {
        public Permissions: KnockoutObservable<NotificationPermission> = <KnockoutObservable<NotificationPermission>>(ko.observable("default"));
        public Notices: KnockoutObservableArray<Notification> = ko.observableArray([]);

        constructor() {
            var ntf = ((Notification) as any) as IFixedNotificationDeclaration;
            this.Permissions(ntf.permission);

            if(this.Permissions() == "default")
                Notification.requestPermission().then(this.onRequestPermission.bind(this));
        }

        private onRequestPermission(result: NotificationPermission) {
            
        }

        public Notify(title: string, msg: string, icon?: string) {
            var options: NotificationOptions = { body: msg };
            //options.tag;
            if (icon) options.icon = icon;

            var notification = new Notification(title, options);
            //notification.onclick()
            this.Notices.push(notification);

            //setTimeout(n.close.bind(n), 5000); 
        }
    }
}

interface NotificationOptions {
    requireInteraction?: boolean;
    silent?: boolean;
    timestamp?: number;
}
