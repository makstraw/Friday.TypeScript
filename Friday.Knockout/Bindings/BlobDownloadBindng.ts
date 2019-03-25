///<reference path="../../Friday.Base/Extensions/ArrayExtensions.ts"/>
namespace Friday.Knockout.BindingHandlers {

    export interface IBlobDownloadInput {
        Data: string;
        FileName?: string;
        Mime?: string;
    }

    export class BlobDownloadBinding implements KnockoutBindingHandler {
        public static update(element: HTMLElement,
            valueAccessor: () => IBlobDownloadInput,
            allBindingsAccessor: KnockoutAllBindingsAccessor,
            viewModel,
            bindingContext: KnockoutBindingContext): void {
            let value = ko.unwrap(valueAccessor());
            if (typeof value.FileName === "string" && !value.FileName.IsEmpty)
                element.setAttribute("download", value.FileName);

            if (typeof value.Mime === "string" && !value.Mime.IsEmpty)
                element.setAttribute("type",value.Mime);


            element.setAttribute("href", URL.createObjectURL(new Blob([value.Data])));
        }
    }
}

interface KnockoutBindingHandlers {
    BlobDownload: KnockoutBindingHandler;
}


ko.bindingHandlers.BlobDownload= Friday.Knockout.BindingHandlers.BlobDownloadBinding;

