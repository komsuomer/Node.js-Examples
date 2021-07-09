const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementById('host_canvas');
const canvasCtx = canvasElement.getContext('2d');

const HEIGHT = 360
const WIDTH = 640

var commands = ''
sessionStorage.setItem('commands', commands)

function onResults(results) {
    canvasCtx.save();
    if (results.multiHandLandmarks) {
        distance8_6 = Math.sqrt(Math.pow(results.multiHandLandmarks[0][6].x - results.multiHandLandmarks[0][8].x, 2) + Math.pow(results.multiHandLandmarks[0][6].y - results.multiHandLandmarks[0][8].y, 2))
        distance8_12 = Math.sqrt(Math.pow(results.multiHandLandmarks[0][12].x - results.multiHandLandmarks[0][8].x, 2) + Math.pow(results.multiHandLandmarks[0][12].y - results.multiHandLandmarks[0][8].y, 2))
        distance12_16 = Math.sqrt(Math.pow(results.multiHandLandmarks[0][16].x - results.multiHandLandmarks[0][12].x, 2) + Math.pow(results.multiHandLandmarks[0][16].y - results.multiHandLandmarks[0][12].y, 2))

        if (distance8_6 < distance8_12) {
            canvasCtx.fillRect(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH, results.multiHandLandmarks[0][8].y * HEIGHT, 7, 7)
            commands += '0,'+ (Math.round(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH)).toString()+','+ (Math.round(results.multiHandLandmarks[0][8].y * HEIGHT)).toString()+'//'
        } else if (distance8_6 < distance12_16) {
            canvasCtx.fillRect(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH, results.multiHandLandmarks[0][8].y * HEIGHT, 1, 1)
            commands += '1,'+ (Math.round(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH)).toString()+','+ (Math.round(results.multiHandLandmarks[0][8].y * HEIGHT)).toString()+'//'
            return
        } else {
            canvasCtx.clearRect(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH, results.multiHandLandmarks[0][8].y * HEIGHT, 10, 10);
            commands += '2,'+ (Math.round(WIDTH - results.multiHandLandmarks[0][8].x * WIDTH)).toString()+','+ (Math.round(results.multiHandLandmarks[0][8].y * HEIGHT)).toString()+'//'

        }

    }
    canvasCtx.restore();

    
    // canvasImageData = canvasCtx.getImageData(0, 0, WIDTH, HEIGHT)
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({
            image: videoElement
        });
    },
    width: WIDTH,
    height: HEIGHT
});
camera.start();



// setInterval(function(){ 
//     if(commands != ''){
//         let sessionCommands = sessionStorage.getItem('commands')
//         sessionCommands = sessionCommands + commands
//         sessionStorage.setItem('commands', sessionCommands)
//         commands = ''
//     }
    

// }, 500);

