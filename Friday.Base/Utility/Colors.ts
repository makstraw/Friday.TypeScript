namespace Friday.Utility {
    export interface RGB {
        Red: number;
        Green: number;
        Blue: number;
    }

    export interface HSL {
        Hue: number;
        Saturation: number;
        Light: number;
    }

    export interface HSV {
        Hue: number;
        Saturation: number;
        Value: number;
    }

    export class Colors {
        private static intToHex(value: number): string {
            var output = value.toString(16);
            if (output.length == 1) output = "0" + output;
            return output;
        }
        public static RgbToHex(colors: RGB, includeSharp = true): string {
            var output: string = "";
            if (includeSharp) output += "#";
            output += Colors.intToHex(colors.Red);
            output += Colors.intToHex(colors.Green);
            output += Colors.intToHex(colors.Blue);
            return output;
        }

        private static isValidColors(...colors: Array<number>): boolean {
            if (colors.length == 0) return false;

            for (let i = 0; i < colors.length; i++) {
                if (!this.isValidColor(colors[i])) return false;
            }
            return true;
        }

        private static isValidColor(color: number): boolean {
            if (0 <= color && color <= 255) return true;
            else return false;
        }

        private static isValidHue(hue: number): boolean {
            if (0 <= hue && hue <= 359) return true;
            else return false;
        }

        private static isValidPercent(percent: number): boolean {
            if (0 <= percent && percent <= 99) return true;
            else return false;
        }

        public static RgbToHsl(r: number, g: number, b: number): HSL {
            if (!Colors.isValidColors(r, g, b)) throw new Error("Invalid colors specified");
            r /= 255, g /= 255, b /= 255;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
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

            return { Hue: h, Saturation: s, Light: l }
        }

        private static hueToRgb(p: number, q: number, t: number): number {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        public static HslToRgb(h: number, s: number, l: number): RGB {
            if (!Colors.isValidHue(h)) throw new Error("Invalid Hue specified");
            if (!Colors.isValidPercent(s)) throw new Error("Invalid Saturation specified");
            if (!Colors.isValidPercent(l)) throw new Error("Invalid Lightness specified");
            h = h / 359;
            l = l / 99;
            s = s / 99;

            var r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;

                r = Colors.hueToRgb(p, q, h + 1 / 3);
                g = Colors.hueToRgb(p, q, h);
                b = Colors.hueToRgb(p, q, h - 1 / 3);
            }
            return { Red: Math.floor(r * 255), Green: Math.floor(g * 255), Blue: Math.floor(b * 255) };
        }

        public static RgbToHsv(r: number, g: number, b: number): HSV {
            if (!Colors.isValidColors(r, g, b)) throw new Error("Invalid colors specified");
            r /= 255, g /= 255, b /= 255;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, v = max;

            var d = max - min;
            s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            } else {
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

            return { Hue: h, Saturation: s, Value: v }
        }

        public static HsvToRgb(h: number, s: number, v: number): RGB {
            if (!Colors.isValidHue(h)) throw new Error("Invalid Hue specified");
            if (!Colors.isValidPercent(s)) throw new Error("Invalid Saturation specified");
            if (!Colors.isValidPercent(v)) throw new Error("Invalid Value specified");
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
        }
    }
}