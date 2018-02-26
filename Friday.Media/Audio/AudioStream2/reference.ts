///<reference path="SampleBuffer.ts"/>
///<reference path="IPlaybackState.ts"/>
///<reference path="IWebAudioApiBackendOptions.ts"/>
///<reference path="BufferQueue.ts"/>
///<reference path="WebAudioApiBackend.ts"/>
///<reference path="AudioBufferSize.ts"/>
///<reference path="AudioStream2.ts"/>

namespace Friday.AudioLib {
    



    //    export function nextTick() {
//        // Don't try to check for setImmediate directly; webpack implements
//        // it using setTimeout which will be throttled in background tabs.
//        // Checking directly on the global window object skips this interference.
//        if (typeof window.setImmediate !== 'undefined') {
//            return window.setImmediate;
//        }
//
//        // window.postMessage goes straight to the event loop, no throttling.
//        if (window && window.postMessage) {
//            var nextTickQueue: Array<Function> = [];
//            window.addEventListener('message', (event: MessageEvent) => {
//                if (event.source === window) {
//                    var data = event.data;
//                    if (typeof data === 'object' && data.nextTickBrowserPingMessage) {
//                        var callback = nextTickQueue.pop();
//                        if (callback) {
//                            callback();
//                        }
//                    }
//                }
//            });
//            return (callback: Function) => {
//                nextTickQueue.push(callback);
//                window.postMessage({
//                        nextTickBrowserPingMessage: true
//                    },
//                    document.location.toString());
//            };
//        }
//
//        // Timeout fallback may be poor in background tabs
//        return (callback: Function) => {
//            setTimeout(callback, 0);
//        }
//    }
}