///<reference path="../../../Friday.Base/Utility/CookieHelper.ts"/>
// ReSharper disable once InconsistentNaming
interface KnockoutExtenders {
    Cookie: (target: any, key: any) => void;
}

ko.extenders.Cookie = (target: any, key: any) => {
    let initialValue = target();
    if (key && Friday.Utility.CookieHelper.GetCookie(key) !== null) {
        try {
            initialValue = JSON.parse(Friday.Utility.CookieHelper.GetCookie(key));
        } catch (e) {

        }

    }
    target(initialValue);
    target.subscribe((newValue: any): void => {
        Friday.Utility.CookieHelper.SetCookie(key, ko.toJSON(newValue), 365);
    });
    return target;
}