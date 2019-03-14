///<reference path="NoticeViewModel.ts"/>
module Friday.Knockout.ViewModels.Notices {

    export abstract class NoticeStackViewModel {
        public Data: KnockoutObservableArray<NoticeViewModel> = ko.observableArray([]);

        public Add(item: NoticeViewModel) {
            this.Data.push(item);
        }

        public Remove(item: NoticeViewModel) {
            this.Data.remove(item);
        }

        public abstract Show(element: any, index: number, data: any);

        public abstract Hide(element: any, index: number, data: any);
    }
}