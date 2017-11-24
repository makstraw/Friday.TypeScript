var AtsLibUtility;
(function (AtsLibUtility) {
    var CookieHelper = (function () {
        function CookieHelper() {
        }
        CookieHelper.SetCookie = function (name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        };
        CookieHelper.GetCookie = function (name) {
            var nameEq = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ")
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEq) === 0)
                    return decodeURIComponent(c.substring(nameEq.length, c.length));
            }
            return null;
        };
        CookieHelper.EraseCookie = function (name) {
            CookieHelper.SetCookie(name, "", -1);
        };
        return CookieHelper;
    }());
    AtsLibUtility.CookieHelper = CookieHelper;
})(AtsLibUtility || (AtsLibUtility = {}));
ko.extenders.Cookie = function (target, key) {
    var initialValue = target();
    if (key && AtsLibUtility.CookieHelper.GetCookie(key) !== null) {
        try {
            initialValue = JSON.parse(AtsLibUtility.CookieHelper.GetCookie(key));
        }
        catch (e) {
        }
    }
    target(initialValue);
    target.subscribe(function (newValue) {
        AtsLibUtility.CookieHelper.SetCookie(key, ko.toJSON(newValue), 365);
    });
    return target;
};
//# sourceMappingURL=CookieHelper.js.map