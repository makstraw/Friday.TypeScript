///<reference path="NoticeSeverity.ts"/>
/// <reference path="../../../Friday.Base/System/Interfaces/IDisposable.ts" />
namespace Friday.Knockout.ViewModels.Notices {
    import IDisposable = System.IDisposable;

    export class NoticeViewModel implements IDisposable{
        public Title: string;
        public Description: string;
        public Severity: NoticeSeverity;
        public Active: KnockoutObservable<boolean>;

        private timeoutHandler: number;

        public Dispose(): void {
            clearTimeout(this.timeoutHandler);
        }

        private static stackInstance: NoticeStackViewModel;

        public static Init(stackInstance: NoticeStackViewModel) {
            this.stackInstance = stackInstance;
        }

        constructor(severity: NoticeSeverity, description: string, title: string) {
            this.Title = title;
            this.Severity = severity;
            this.Description = description;
        }

        public static From(severity: NoticeSeverity, description: string, title: string): NoticeViewModel {
            return new NoticeViewModel(severity, description, title);
        }

        public static FromSuccessMessage(description: string, title: string): NoticeViewModel {
            return new NoticeViewModel(NoticeSeverity.Success, description, title);
        }

        public static FromFailureMessage(description: string, title: string): NoticeViewModel {
            return new NoticeViewModel(NoticeSeverity.Failure, description, title);
        }

        public static FromNotification(description: string, title: string): NoticeViewModel {
            return new NoticeViewModel(NoticeSeverity.Notice, description, title);
        }

        public static FromExceptionMessage(description: string, title: string): NoticeViewModel {
            return new NoticeViewModel(NoticeSeverity.Exception, description, title);
        }

        public Dispatch(timeout = 2000) {
            NoticeViewModel.stackInstance.Add(this);
            this.Decay(timeout);
        }

        public Decay(timeout: number) {
            this.timeoutHandler = setTimeout(() => {
                    NoticeViewModel.stackInstance.Remove(this);
                    this.Dispose();
                },
                timeout);
        }
    }
}