namespace AtsLibUtility {
    export class CookieHelper {
        public static SetCookie(name: string, value: string, days: number) {
            var expires: string;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = `; expires=${date.toUTCString()}`;
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        }

        public static GetCookie(name: string) {
            var nameEq = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(";");
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") c = c.substring(1, c.length);
                if (c.indexOf(nameEq) === 0) return decodeURIComponent(c.substring(nameEq.length, c.length));
            }
            return null;
        }

        public static EraseCookie(name: string) {
            CookieHelper.SetCookie(name, "", -1);
        }
    }

}

interface KnockoutExtenders {
    Cookie: (target: any, key: any) => void;
}

ko.extenders.Cookie = (target, key) => {
    var initialValue = target();
    if (key && AtsLibUtility.CookieHelper.GetCookie(key) !== null) {
        try {
            initialValue = JSON.parse(AtsLibUtility.CookieHelper.GetCookie(key));
        }catch(e){
            
        }

    }
    target(initialValue);
    target.subscribe((newValue: any): void =>{
        AtsLibUtility.CookieHelper.SetCookie(key, ko.toJSON(newValue), 365);
    });
    return target;
}