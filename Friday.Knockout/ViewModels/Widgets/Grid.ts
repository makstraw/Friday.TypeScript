﻿namespace Friday.Knockout.ViewModels.Widgets {
    export class Grid {
        public HorizontalGridStepPx: KnockoutObservable<number>;
        public VerticalGridStepPx: KnockoutObservable<number>;

        constructor(horizontalGridStepPx: number, verticalGridStepPx?: number) {
            this.HorizontalGridStepPx = ko.observable(horizontalGridStepPx);
            if (typeof verticalGridStepPx === "undefined")
                this.VerticalGridStepPx = ko.observable(horizontalGridStepPx);
            else this.VerticalGridStepPx = ko.observable(verticalGridStepPx);
        }

        private roundPixelsToGrid(pixels: number, step: number, min?: number, max?: number): number {
            let output: number = Math.round(pixels / step) * step;
            if (typeof min !== "undefined" && typeof max !== "undefined") {
                if (output < min) output = min;
                else if (output > max) output = max;
            };
            return output;
        }

        public AlignPositionToGrid(position: WidgetPosition) {
            position.Top(this.roundPixelsToGrid(position.Top(), this.VerticalGridStepPx()));
            position.Left(this.roundPixelsToGrid(position.Left(), this.HorizontalGridStepPx()));
        }

        public AlignSizeToGrid(size: WidgetSize, minSize: WidgetSize, maxSize: WidgetSize) {
            size.Height(this.roundPixelsToGrid(size.Height(), this.VerticalGridStepPx(), minSize.Height(), maxSize.Height()));
            size.Width(this.roundPixelsToGrid(size.Width(), this.HorizontalGridStepPx(), minSize.Width(), maxSize.Width()));
        }
    }
}