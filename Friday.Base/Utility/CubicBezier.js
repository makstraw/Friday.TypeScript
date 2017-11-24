var AtsLibUtility;
(function (AtsLibUtility) {
    var UnitBezier = (function () {
        function UnitBezier() {
        }
        return UnitBezier;
    }());
    AtsLibUtility.UnitBezier = UnitBezier;
    var CubicBezier = (function () {
        /**
        * Defines a cubic-bezier curve given the middle two control points.
        * NOTE: first and last control points are implicitly (0,0) and (1,1).
        * @param p1x {number} X component of control point 1
        * @param p1y {number} Y component of control point 1
        * @param p2x {number} X component of control point 2
        * @param p2y {number} Y component of control point 2
        */
        function CubicBezier(p1x, p1y, p2x, p2y) {
            this.DEFAULT_DURATION = 400; //Ms
            //Polynominal coefficients
            this.coefficientC = 3.0;
            this.coefficientB = 3.0;
            this.coefficientA = 1.0;
            this.cx = this.coefficientC * p1x;
            this.bx = this.coefficientB * (p2x - p1x) - this.cx;
            this.ax = this.coefficientA - this.cx - this.bx;
            this.cy = this.coefficientC * p1y;
            this.by = this.coefficientB * (p2y - p1y) - this.cy;
            this.ay = this.coefficientA - this.cy - this.by;
        }
        /**
        * The epsilon value we pass to UnitBezier::solve given that the animation is going to run over |dur| seconds.
        * The longer the animation, the more precision we need in the timing function result to avoid ugly discontinuities.
        * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/page/animation/AnimationBase.cpp
        */
        CubicBezier.prototype.solveEpsilon = function (duration) {
            return 1.0 / (200.0 * duration);
        };
        ;
        /**
         * @param t {number} parametric timing value
         * @return {number}
         */
        CubicBezier.prototype.sampleCurveX = function (t) {
            // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
            return ((this.ax * t + this.bx) * t + this.cx) * t;
        };
        ;
        /**
        * @param t {number} parametric timing value
        * @return {number}
        */
        CubicBezier.prototype.sampleCurveY = function (t) {
            return ((this.ay * t + this.by) * t + this.cy) * t;
        };
        ;
        /**
        * @param t {number} parametric timing value
        * @return {number}
        */
        CubicBezier.prototype.sampleCurveDerivativeX = function (t) {
            return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
        };
        ;
        /**
        * Given an x value, find a parametric value it came from.
        * @param x {number} value of x along the bezier curve, 0.0 <= x <= 1.0
        * @param epsilon {number} accuracy limit of t for the given x
        * @return {number} the t value corresponding to x
        */
        CubicBezier.prototype.solveCurveX = function (x, epsilon) {
            var t0;
            var t1;
            var t2;
            var x2;
            var d2;
            var i;
            // First try a few iterations of Newton's method -- normally very fast.
            for (t2 = x, i = 0; i < 8; i++) {
                x2 = this.sampleCurveX(t2) - x;
                if (Math.abs(x2) < epsilon) {
                    return t2;
                }
                d2 = this.sampleCurveDerivativeX(t2);
                if (Math.abs(d2) < 1e-6) {
                    break;
                }
                t2 = t2 - x2 / d2;
            }
            // Fall back to the bisection method for reliability.
            t0 = 0.0;
            t1 = 1.0;
            t2 = x;
            if (t2 < t0) {
                return t0;
            }
            if (t2 > t1) {
                return t1;
            }
            while (t0 < t1) {
                x2 = this.sampleCurveX(t2);
                if (Math.abs(x2 - x) < epsilon) {
                    return t2;
                }
                if (x > x2) {
                    t0 = t2;
                }
                else {
                    t1 = t2;
                }
                t2 = (t1 - t0) * 0.5 + t0;
            }
            // Failure.
            return t2;
        };
        ;
        /**
        * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
        * @param epsilon {number} the accuracy of t for the given x
        * @return {number} the y value along the bezier curve
        */
        CubicBezier.prototype.solve = function (x, epsilon) {
            return this.sampleCurveY(this.solveCurveX(x, epsilon));
        };
        ;
        // public interface --------------------------------------------
        /**
         * Find the y of the cubic-bezier for a given x with accuracy determined by the animation duration.
         * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
         * @param duration {number} the duration of the animation in milliseconds
         * @return {number} the y value along the bezier curve
         */
        CubicBezier.prototype.Do = function (x, duration) {
            return this.solve(x, this.solveEpsilon(+duration || this.DEFAULT_DURATION));
        };
        ;
        return CubicBezier;
    }());
    AtsLibUtility.CubicBezier = CubicBezier;
})(AtsLibUtility || (AtsLibUtility = {}));
//# sourceMappingURL=CubicBezier.js.map