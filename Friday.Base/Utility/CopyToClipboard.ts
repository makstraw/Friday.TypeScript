namespace Friday.Utility {

    export function copyToClipboard(element: HTMLElement) {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        var target: HTMLTextAreaElement;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = <HTMLTextAreaElement>(element);
            origSelectionStart = (<HTMLInputElement>element).selectionStart;
            origSelectionEnd = (<HTMLInputElement>element).selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = <HTMLTextAreaElement>(document.getElementById(targetId));
            if (!target) {
                target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = element.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
        } catch (e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof (<HTMLInputElement>currentFocus).focus === "function") {
            (<HTMLInputElement>currentFocus).focus();
        }

        if (isInput) {
            // restore prior selection
            (<HTMLInputElement>element).setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }
}