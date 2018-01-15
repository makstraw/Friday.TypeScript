namespace Friday.Knockout.ViewModels.Notices {

    interface INoticeRoute {
        Name: string;
        HandlingFunction: Function;
    }

    export class NoticeRouter {
        private routes: Array<INoticeRoute> = [];
        private defaultRoute: Function;

        constructor(defaultRoute: Function) {
            this.defaultRoute = defaultRoute;
        }

        public Register(name: string, callback: Function) {
            this.routes.push({ Name: name, HandlingFunction: callback });
        }

        private findRoute(name: string): INoticeRoute {
            for (var i = 0; i < this.routes.length; i++) {
                if (this.routes[i].Name == name) return this.routes[i];
            }
            return null;
        }

        public Route(notice: NoticeViewModel) {
            let customRoute = this.findRoute(notice.Code);
            if (customRoute != null) {
                customRoute.HandlingFunction(notice);
            } else {
                this.defaultRoute(notice);
            }
        }

    }
}