let current_tryon;
let faceModel = false;
let handModel = false;
const videoElement = document.getElementById("input_video");
const videoElement2 = document.getElementById("input_video2");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

function handsOnResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    canvasCtx.restore();
}

function faceonResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                { color: '#C0C0C070', lineWidth: 1 });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' });
            drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' });
        }
    }
    canvasCtx.restore();
}

function changeModel(model_input) {
    if (model_input == "necklace") {
        faceModel = true;
        handModel = false;
    }
    else if (model_input == "set") {
        faceModel = true;
        handModel = false;
    }
    else if (model_input == "earring") {
        faceModel = true;
        handModel = false;
    }
    else if (model_input == "ring") {
        handModel = true;
        faceModel = false;
    }
    else if (model_input == "bracelet") {
        handModel = true;
        faceModel = false;
    }
}

function tryon(jewellery) {
    videoElement.classList.add("d-none");
    canvasElement.classList.remove("d-none");
    current_tryon = jewellery;
    changeModel(current_tryon)
    console.log(current_tryon);
}


function initialVideo() {
    const camera = new Camera(videoElement, {
        onFrame: async () => {  
            if (handModel) {
                await faceMesh.send({ image: videoElement });
            } else {
                await hands.send({ image: videoElement });
            }
        },
        width: 1280,
        height: 720
    });

    const camera2 = new Camera(videoElement2, {
        onFrame: async () => {  
            if (handModel) {
                await hands.send({ image: videoElement2 });
            } else {
                await faceMesh.send({ image: videoElement2 });
            }
        },
        width: 1280,
        height: 720
    });

    hands.onResults(handsOnResults);
    faceMesh.onResults(faceonResults);
    camera.start();
    camera2.start();
}
initialVideo();