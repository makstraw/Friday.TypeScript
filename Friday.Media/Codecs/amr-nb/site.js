// Write your JavaScript code.
var audioCtx = new AudioContext();
var channels = 2;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 2.0;

var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

function test() {
    var f = document.getElementById('file').files[0];
    var reader = new FileReader();
    var ctx = new AudioContext();
    

    reader.onload = function(event) {
        var samples = new AMR({}).decode(new Uint8Array(event.target.result));


        var audioBuffer = ctx.createBuffer(1, samples.length, 8000);
        var source = ctx.createBufferSource();
        var channelData = audioBuffer.getChannelData(0);
        channelData.set(samples, 0);

        source.buffer = audioBuffer;


        source.connect(ctx.destination);
        source.start();


    }
    reader.readAsArrayBuffer(f);
}