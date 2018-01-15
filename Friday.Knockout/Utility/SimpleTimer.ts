namespace Friday.Knockout.Utility {
    export class SimpleTimer {
        private timerValue: KnockoutObservable<number>;
        private intervalHandle: number;

        constructor(timerValuePointer: KnockoutObservable<number>) {
            this.timerValue = timerValuePointer;
        }

        public Set(value: number) {
            this.timerValue(value);
        }

        public Start() {
            this.intervalHandle = setInterval(this.timerTick.bind(this), 1000);
        }

        public Stop() {
            clearInterval(this.intervalHandle);
        }

        private timerTick() {
            if (this.timerValue() == 0) this.Stop();
            else
                this.timerValue(this.timerValue() - 1);
        }
    }
}