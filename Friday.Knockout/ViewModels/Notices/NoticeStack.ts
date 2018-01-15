///<reference path="NoticeViewModel.ts"/>
module Friday.Knockout.ViewModels.Notices {

    export abstract class NoticeStack {
        public Data: KnockoutObservableArray<NoticeViewModel> = ko.observableArray([]);

        public Add(item: NoticeViewModel) {
            this.Data.push(item);
            setTimeout(this.Remove.bind(this), 5000, item);
        }

        public Remove(item: NoticeViewModel) {
            this.Data.remove(item);
        }

        public abstract Show(element: any, index: number, data: any);

        public abstract Hide(element: any, index: number, data: any);
    }
}