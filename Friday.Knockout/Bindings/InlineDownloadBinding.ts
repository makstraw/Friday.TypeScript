///<reference path="../../Friday.Base/Extensions/ArrayExtensions.ts"/>
namespace Friday.Knockout.BindingHandlers {

    export interface IInlineDownloadInput {
        Data: string;
        FileName?: string;
        Base64?: boolean;
        Mime?: string;
        Charset?: string;
    }

    export class InlineDownloadBinding implements KnockoutBindingHandler {
        public static update(element: HTMLElement,
            valueAccessor: () => IInlineDownloadInput,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel,
            bindingContext: KnockoutBindingContext): void {
            let value = ko.unwrap(valueAccessor());

            if (typeof value.FileName === "string" && !value.FileName.IsEmpty)
                element.setAttribute("download", value.FileName);

            let href = "data:";
            
            if (typeof value.Mime === "string" && !value.Mime.IsEmpty)
                href += value.Mime + ";";

            if (typeof value.Charset === "string" && !value.Charset.IsEmpty)
                href += value.Charset + ";";


            if (typeof value.Base64 === "boolean" && value.Base64) {
                href += "base64,"+btoa(value.Data);
            } else {
                href += "," + encodeURIComponent(value.Data);
            }

            element.setAttribute("href", href);
        }
    }
}

interface KnockoutBindingHandlers {
    InlineDownload: KnockoutBindingHandler;
}


ko.bindingHandlers.InlineDownload = Friday.Knockout.BindingHandlers.InlineDownloadBinding;

