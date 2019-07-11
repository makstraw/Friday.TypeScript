/// <reference path="../../Friday.Base/Utility/EventHandler.ts" />
namespace Friday.Knockout.ViewModels {
    import EventHandler = Friday.Utility.EventHandler;

    export class FullScreenViewModel {
        public Status: KnockoutObservable<boolean> = ko.observable(false);
        public OnError: EventHandler<null> = new EventHandler<null>();

        private requestFunction: Function = document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen || this.nullFunction;
        private cancelFunction: Function = document.cancelFullScreen || document.mozCancelFullScreen || this.nullFunction;
        
        private element: HTMLElement;

        private callbacks: Array<Function> = []

        constructor(element?: HTMLElement) {
            if (typeof element === "undefined") element = document.documentElement;
            this.SetElement(element);
            document.addEventListener("fullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("fullscreenerror", this.error.bind(this));
            document.addEventListener("mozfullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("mozfullscreenerror", this.error.bind(this));
            document.addEventListener("webkitfullscreenchange", this.stateChanged.bind(this));
            document.addEventListener("webkitfullscreenerror", this.error.bind(this));

            this.cancelFunction = this.cancelFunction.bind(document);
        }

        private fullscreenElement(): Element | null {
            return document.fullscreenElement || document.mozFullScreenElement;
        }

        public SetElement(element: HTMLElement) {
            this.element = element;
            this.requestFunction = element.requestFullscreen || element.mozRequestFullScreen || this.nullFunction;
            this.requestFunction = this.requestFunction.bind(element);
        }

        public Toggle(element?: HTMLElement, callback?: Function) {
            if (typeof element !== "undefined") this.SetElement(element);
            if (typeof callback === "function") this.callbacks.push(callback);
            if (!this.fullscreenElement()) {
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
            while (this.callbacks.length > 0) {
                let callback = this.callbacks.pop();
                callback(this.Status());
            }
        }

        private error(event: Event) {
            this.OnError.Call();
        }

        private nullFunction() {

        }
    }
}

interface Document extends Node, GlobalEventHandlers, DocumentEvent, ParentNode, DocumentOrShadowRoot {
    readonly mozFullScreenElement: Element | null;
    mozCancelFullScreen(): void;
    cancelFullScreen(): void;
}

interface Element extends Node, GlobalEventHandlers, ChildNode, ParentNode {
    mozRequestFullScreen(): void;

}

interface DocumentEventMap extends GlobalEventHandlersEventMap {
    "mozfullscreenchange": Event;
    "mozfullscreenerror": Event;
}