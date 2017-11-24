namespace Friday.Animation.CoinStack {
    export class Coin {
        private container: HTMLImageElement;
        public XPosition: number;
        public YPosition: number;
        public StartTime: number;
        public Durartion: number;
        public XDrop: number;
        public YDrop: number;
        public Status: CoinStatus = 'fadein';
        private opacity: boolean;

        constructor(imageSource: string, width: number, height: number, opacity: boolean) {
            //Creates image element with the correct source.
            this.container =  document.createElement('img');
            this.container.src = imageSource;
            this.opacity = opacity;

            this.container.style.position = "absolute";
            this.container.style.width = width + "px";
            this.container.style.height = height + "px";
            if(this.opacity)
                this.container.style.opacity = '0';//Default to 0 to avoid rendering glitches on slower PC's
        }

        public FadeIn(frame: number, stackSize: number) {
            this.container.style.bottom = this.YPosition + (this.YDrop * (1.0 - frame) * stackSize) + "px";
            this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
            if(this.opacity)
                this.container.style.opacity = frame.toString();
        }

        public FadeOut(frame: number, stackSize: number) {
            this.container.style.bottom = this.YPosition + (this.YDrop * (frame) * stackSize) + "px";
            this.container.style.left = this.XPosition + (this.XDrop * (1.0 - frame) * stackSize) + "px";
            if (this.opacity)
                this.container.style.opacity = (1.0 - frame).toString();//TODO?
        }

        public GetOpactiy(): number {
            if (!this.opacity) return 1;
            return parseFloat(this.container.style.opacity);
        }

        public UpdateOpactity(value: number) {
            if (this.opacity)
                this.container.style.opacity = value.toString();
        }

        public Attach(parent: HTMLElement) {
            parent.appendChild(this.container);
        }

        public Detach(parent: HTMLElement) {
            parent.removeChild(this.container);
        }
    }
}