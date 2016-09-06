//常规声明
var file = document.getElementById('audiofile');
var FR = new FileReader();
var fc;
var absn;
var an;
var ac = new AudioContext();
absn = ac.createBufferSource();
an = ac.createAnalyser();
an.fftSize = 256;
file.onchange = function () {
    fc = file['files'][0];
    if (fc) {
        FR.onload = function (e) {
            console.log("正在加载...");
            console.log("正在解码...");
            //解码文件
            ac.decodeAudioData(e.target['result'], function (buffer) {
                console.log("解码完毕。");
                absn.connect(an);
                an.connect(ac.destination);
                console.log("开始播放。");
                absn.buffer = buffer;
                absn.start(0);
                console.log("分析数据。");
                console.log(an);
                window.requestAnimationFrame(onLoop);
            });
        };
        FR.readAsArrayBuffer(fc);
    }
};
var start = null;
function onLoop(timestamp) {
    if (!start)
        start = timestamp;
    var progress = timestamp - start;
    var array = new Uint8Array(an.frequencyBinCount);
    an.getByteFrequencyData(array);
    for (var i = 0; i < 96; i++) {
        if (i % 3 == 0) {
            var ele = document.getElementById("effect" + i / 3);
            // console.log(ele);
            ele.style.height = ((array[i] / 255) * 100) + "%";
        }
    }
    window.requestAnimationFrame(onLoop);
}
function initDiv() {
    var divContainer = document.getElementById("container");
    for (var i = 0; i < 32; i++) {
        var block = document.createElement("div");
        block.id = "block" + i;
        block.className = "block";
        var effect = document.createElement("div");
        effect.id = "effect" + i;
        effect.className = "effect";
        block.appendChild(effect);
        divContainer.appendChild(block);
    }
}
initDiv();
