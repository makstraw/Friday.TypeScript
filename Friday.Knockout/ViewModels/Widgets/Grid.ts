namespace Friday.Knockout.ViewModels.Widgets {
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

        public AlignSizeToGrid(dimension: number, step: number): number {
            return this.roundPixelsToGrid(dimension, step);
        }

        public RespectWorkspaceBoundaries(position: WidgetPosition, size: WidgetSize, worskpaceWidth, workspaceHeight) {

        }

        public AllocateSpace(size: WidgetSize): WidgetPosition {
            return WidgetPosition.Zero;
        }
    }
}