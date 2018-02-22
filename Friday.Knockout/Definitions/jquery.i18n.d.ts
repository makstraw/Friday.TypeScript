interface I18NOptions {
    locale: string;
    parser?: any;
    messageStore?: any;

}

interface I18NMessageKeyPair {
    
}

interface I18NLocalePathPair {

}

interface I18NLocaleMessageKeyPair {
    
}

interface I18NMessageStore {
    messages: object;
}

interface I18N {
    load(source: I18NLocalePathPair): JQueryPromise<any>;
    load(source: I18NLocaleMessageKeyPair): JQueryPromise<any>;
    load(source: I18NMessageKeyPair, locale: string): JQueryPromise<any>;
    load(source: string): JQueryPromise<any>;
    load(source: string, locale: string): JQueryPromise<any>;
    language: Array<string>;
    options: object;
    parser: object;
    locale: string;
    messageStore: I18NMessageStore;
    languages: object;

}

interface JQueryStatic {
    i18n(): I18N;
    i18n(options: I18NOptions): I18N;
    i18n(key: string): string;
    i18n(key: string, param1?: any): string;
    i18n(key: string, ...args: any[]): string;

}