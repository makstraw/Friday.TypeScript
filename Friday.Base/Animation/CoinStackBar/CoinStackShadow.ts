namespace Friday.Animation.CoinStack {
    export class CoinStackShadow {
        private container: HTMLElement;
        private width: number;

        constructor(stacksize: number, coinImgHeight: number, coinImgWidth: number, containerHeight: number) {
            this.width = coinImgWidth * stacksize * 2;

            this.container = document.createElement('div');
            this.container.style.position = 'relative';
            this.container.style.width = this.width + 'px';
            this.container.style.height = coinImgHeight * stacksize * 2 + 'px';
            this.container.style.top = containerHeight - (coinImgHeight * stacksize * 1.5) + 'px';
            this.container.style.left = this.width / 4 + 'px';
            this.container.style.opacity = '0';
            this.container.style.background = '-webkit-radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
            this.container.style.background = 'radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
        }

        public Attach(parent: HTMLElement) {
            parent.appendChild(this.container);
        }

        public UpdateOpactity(value: number) {
            this.container.style.opacity = value.toString();
        }
    }
}