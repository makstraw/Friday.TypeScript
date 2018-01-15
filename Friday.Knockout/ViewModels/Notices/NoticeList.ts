namespace Friday.Knockout.ViewModels.Notices {
    export class NoticeList {
        public Data: KnockoutObservableArray<NoticeViewModel> = ko.observableArray([]);
        public CurrentIndex: KnockoutObservable<number> = ko.observable(0);

        public Next() {
            this.SetIndex(this.CurrentIndex() + 1);
        }

        public Previous() {
            this.SetIndex(this.CurrentIndex() - 1);
        }

        public First() {
            this.SetIndex(0);
        }

        public Last() {
            this.SetIndex(this.Data().length - 1);
        }

        public Add(data: NoticeViewModel) {
            this.Data.push(data);
            this.SetIndex(this.Data().length - 1);
            setTimeout(this.Remove.bind(this), Math.random() * 5000 + 5000, data);
        }

        public Remove(item: NoticeViewModel) {
            this.Data.remove(item);
            this.SetIndex(this.CurrentIndex() - 1);
        }

        public SetIndex(index: number) {
            if (index >= 0 && index <= this.Data().length - 1) {
                this.Data()[this.CurrentIndex()].Active(false);
                this.CurrentIndex(index);
                if (this.Data().length > 0) this.Data()[this.CurrentIndex()].Active(true);
            }

        }
    }
}