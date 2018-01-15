namespace Friday.Knockout.ViewModels.Notices {

    export type NoticeSeverity = "Success" | "Notice" | "Warning" | "Exception" | "Critical";

    export class NoticeViewModel {
        public Code: string;
        public Title: string;
        public Description: string;
        public Severity: NoticeSeverity;
        public Active: KnockoutObservable<boolean>;
    }
}