var AtsLibUtility;
(function (AtsLibUtility) {
    var Colors = (function () {
        function Colors() {
        }
        Colors.intToHex = function (value) {
            var output = value.toString(16);
            if (output.length == 1)
                output = "0" + output;
            return output;
        };
        Colors.RgbToHex = function (colors, includeSharp) {
            if (includeSharp === void 0) { includeSharp = true; }
            var output = "";
            if (includeSharp)
                output += "#";
            output += Colors.intToHex(colors.Red);
            output += Colors.intToHex(colors.Green);
            output += Colors.intToHex(colors.Blue);
            return output;
        };
        Colors.isValidColors = function () {
            var colors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                colors[_i] = arguments[_i];
            }
            if (colors.length == 0)
                return false;
            for (var i = 0; i < colors.length; i++) {
                if (!this.isValidColor(colors[i]))
                    return false;
            }
            return true;
        };
        Colors.isValidColor = function (color) {
            if (0 <= color && color <= 255)
                return true;
            else
                return false;
        };
        Colors.isValidHue = function (hue) {
            if (0 <= hue && hue <= 359)
                return true;
            else
                return false;
        };
        Colors.isValidPercent = function (percent) {
            if (0 <= percent && percent <= 99)
                return true;
            else
                return false;
        };
        Colors.RgbToHsl = function (r, g, b) {
            if (!Colors.isValidColors(r, g, b))
                throw new Error("Invalid colors specified");
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return { Hue: h, Saturation: s, Light: l };
        };
        Colors.hueToRgb = function (p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        Colors.HslToRgb = function (h, s, l) {
            if (!Colors.isValidHue(h))
                throw new Error("Invalid Hue specified");
            if (!Colors.isValidPercent(s))
                throw new Error("Invalid Saturation specified");
            if (!Colors.isValidPercent(l))
                throw new Error("Invalid Lightness specified");
            h = h / 359;
            l = l / 99;
            s = s / 99;
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = Colors.hueToRgb(p, q, h + 1 / 3);
                g = Colors.hueToRgb(p, q, h);
                b = Colors.hueToRgb(p, q, h - 1 / 3);
            }
            return { Red: Math.floor(r * 255), Green: Math.floor(g * 255), Blue: Math.floor(b * 255) };
        };
        Colors.RgbToHsv = function (r, g, b) {
            if (!Colors.isValidColors(r, g, b))
                throw new Error("Invalid colors specified");
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, v = max;
            var d = max - min;
            s = max == 0 ? 0 : d / max;
            if (max == min) {
                h = 0; // achromatic
            }
            else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return { Hue: h, Saturation: s, Value: v };
        };
        Colors.HsvToRgb = function (h, s, v) {
            if (!Colors.isValidHue(h))
                throw new Error("Invalid Hue specified");
            if (!Colors.isValidPercent(s))
                throw new Error("Invalid Saturation specified");
            if (!Colors.isValidPercent(v))
                throw new Error("Invalid Value specified");
            var r, g, b;
            h = h / 359;
            v = v / 99;
            s = s / 99;
            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v, g = t, b = p;
                    break;
                case 1:
                    r = q, g = v, b = p;
                    break;
                case 2:
                    r = p, g = v, b = t;
                    break;
                case 3:
                    r = p, g = q, b = v;
                    break;
                case 4:
                    r = t, g = p, b = v;
                    break;
                case 5:
                    r = v, g = p, b = q;
                    break;
            }
            return { Red: Math.floor(r * 255), Green: Math.floor(g * 255), Blue: Math.floor(b * 255) };
        };
        return Colors;
    }());
    AtsLibUtility.Colors = Colors;
})(AtsLibUtility || (AtsLibUtility = {}));
//# sourceMappingURL=Colors.js.map