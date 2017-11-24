var AtsLibUtility;
(function (AtsLibUtility) {
    function copyToClipboard(element) {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = element.tagName === "INPUT" || element.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        var target;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = (element);
            origSelectionStart = element.selectionStart;
            origSelectionEnd = element.selectionEnd;
        }
        else {
            // must use a temporary form element for the selection and copy
            target = (document.getElementById(targetId));
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
        }
        catch (e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        if (isInput) {
            // restore prior selection
            element.setSelectionRange(origSelectionStart, origSelectionEnd);
        }
        else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }
    AtsLibUtility.copyToClipboard = copyToClipboard;
})(AtsLibUtility || (AtsLibUtility = {}));
//# sourceMappingURL=CopyToClipboard.js.map