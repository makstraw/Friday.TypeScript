/// <reference path="../../Friday.Base/Utility/EventHandler.ts" />
namespace Friday.Knockout.ViewModels {
    import EventHandler = Friday.Utility.EventHandler;

    export class FullScreenViewModel {
        public Status: KnockoutObservable<boolean> = ko.observable(false);
        public OnError: EventHandler<null> = new EventHandler<null>();

        private requestFunction: Function = document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || document.documentElement.webkitRequestFullscreen || this.null;
        private cancelFunction: Function = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || this.null;
        
        private readonly element: HTMLElement;

        constructor(element?: HTMLElement) {
            this.element = element;
            document.addEventListener("fullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("fullscreenerror", this.error.bind(this));
            document.addEventListener("mozfullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("mozfullscreenerror", this.error.bind(this));
            document.addEventListener("webkitfullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("webkitfullscreenerror", this.error.bind(this));
            this.requestFunction = this.requestFunction.bind(document.documentElement);
            this.cancelFunction = this.cancelFunction.bind(document);
        }

        private fullscreenElement(): Element | null {
            return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        }

        public Toggle() {
            if (this.fullscreenElement()) {
                this.requestFunction();
            } else {
                this.cancelFunction();
            }
        }

        public Request() {
            this.requestFunction();
        }

        public Cancel() {
            this.cancelFunction();
        }

        private stateChanged(event: Event) {
            this.Status(this.fullscreenElement() ? true : false);
        }

        private error(event: Event) {
            this.OnError.Call();
        }

        private null() {

        }
    }
}

interface Document extends Node, GlobalEventHandlers, NodeSelector, DocumentEvent, ParentNode, DocumentOrShadowRoot {
    readonly mozFullScreenElement: Element | null;
    mozCancelFullScreen(): void;
    cancelFullScreen(): void;
}

interface Element extends Node, GlobalEventHandlers, ElementTraversal, NodeSelector, ChildNode, ParentNode {
    mozRequestFullScreen(): void;

}

interface DocumentEventMap extends GlobalEventHandlersEventMap {
    "mozfullscreenchange": Event;
    "mozfullscreenerror": Event;
}