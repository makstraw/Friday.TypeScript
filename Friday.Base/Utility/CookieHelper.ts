namespace Friday.Utility {
    export class CookieHelper {
        public static SetCookie(name: string, value: string, days: number, sameSite = "Lax") {
            var expires: string;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = `; expires=${date.toUTCString()}`;
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; SameSite="+sameSite+"; path=/";
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

