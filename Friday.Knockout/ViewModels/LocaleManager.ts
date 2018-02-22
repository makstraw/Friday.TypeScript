namespace Friday.Knockout.ViewModels {
    export interface ILocale {
        LocaleIso: string;
        LocaleName: string;
        Flag: string;
    }

    export class LocaleManager {
        private readonly localePath: string;

        public AvailableLocales: KnockoutObservableArray<ILocale> = ko.observableArray([]);

        public CurrentLocale: KnockoutObservable<ILocale> = ko.observable({ LocaleIso: "", LocaleName: "", Flag: "" });

        public LanguageSelection: KnockoutObservable<boolean> = ko.observable(false);


        public MouseLeave() {
            this.LanguageSelection(false);
        }


        constructor(localePath: string = '/locale/') {
            this.localePath = localePath;
        }

        private loadLocale(localeIso: string): JQueryPromise<any> {
            if (localeIso.length != 2) return null;
            return $.i18n().load(`${this.localePath}${localeIso}.json`, localeIso).done(() => {
                $.i18n({ locale: localeIso });
            });
        }

        private findLocale(localeIso: string): ILocale {
            for (var i = 0; i < this.AvailableLocales().length; i++) {
                if (this.AvailableLocales()[i].LocaleIso == localeIso) return this.AvailableLocales()[i];
            }
            return null;
        }

        private setLocale(locale: ILocale) {
            if (typeof (this.CurrentLocale) == "undefined") {
                this.CurrentLocale = ko.observable(locale);
            } else {
                this.CurrentLocale(locale);
            }
            $("body").i18n();
        }

        public AddLocale(locale: ILocale) {
            this.AvailableLocales.push(locale);
        }

        public SwitchLocale(localeName: string, promise?: Function) {
            var newLocale = this.findLocale(localeName);
            if (newLocale == null) throw ("Locale not found: " + localeName);
            this.loadLocale(localeName).done(() => {
                this.setLocale(newLocale);
                if (typeof promise == "function") promise();
            });
            this.LanguageSelection(false);
        }
    }
}