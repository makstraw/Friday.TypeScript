namespace Friday.Animation.CoinStack {
    export class CoinStackBarConfig {
        Container: HTMLElement;
        ContainerWidthPx?: number;
        ContainerHeightPx?: number;
        CoinImgSrc: string;
        CoinImgWidthPx: number = 1;
        CoinImgHeightPx: number = 1;
        CoinHeightPx: number = 1;
        MinValue?: number = 0;
        MaxValue?: number = 100;
        StartValue?: number = 0;
        MaxStackHeightPcs?: number = 10;
        XOffset?: number = 0;
        YOffset?: number = 0;
        CoinAnimXDrop?: number = 0;
        CoinAnimYDrop?: number = 300;
        CoinEffectDurationMs?: number = 300;
        ShowShadow: boolean = true;
        Seed: number;
        Reseed: Reseed = "always";
        Opacity: boolean = true;
    }
}