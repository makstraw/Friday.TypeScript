namespace AtsLibKnockout {

    export class Counter {
        private intervalHandle: any;

        public AnimationFrame: KnockoutObservable<string> = ko.observable("");


        public Start() {
            this.intervalHandle = setInterval(this.tick.bind(this), 1000);
        }

        public Stop() {
            clearInterval(this.intervalHandle);
        }

        public Reset() {
            
        }

        public Set() {
            
        }

        private animate() {
        
        }

        private tick() {
            
        }
    }
}