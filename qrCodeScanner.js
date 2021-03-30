const qrCodeParser = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");


const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;


qrCodeParser.callback = (res) => {
    if (res) {
        outputData.innerText = res;
        scanning = false;

        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });

        qrResult.hidden = false;
        btnScanQR.hidden = false;
        canvasElement.hidden = true;
    }
};

btnScanQR.onclick = () => {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            scanning = true;
            qrResult.hidden = true;
            btnScanQR.hidden = true;
            canvasElement.hidden = false;
            video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
            video.srcObject = stream;
            video.play();
            tick();
            scan();
        });
};

const tick = () => {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    scanning && requestAnimationFrame(tick);
}

const scan = () => {
    try {
        qrCodeParser.decode();
    } catch (e) {
        setTimeout(scan, 300);
    }
}