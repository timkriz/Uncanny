//javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
let ctx, videoWidth, videoHeight, video, canvas, rafID;
let predictionsGlobal = [];
const VIDEO_SIZE = 500;

async function setupCamera() {
    video = document.getElementById('video');
  
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        // Only setting the video to a specified size in order to accommodate a
        // point cloud, so on mobile devices accept the default size.
        width: VIDEO_SIZE,
        height: VIDEO_SIZE
      },
    });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

async function renderPrediction() {
    //const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5, maxResults:1 })
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }) //128 or 160
    const result = await faceapi.detectSingleFace(video, options).withFaceLandmarks(true)

    if (result) {
        //console.log(result.landmarks.positions[0]);
        predictions = result.landmarks.positions
        predictionsGlobal = result.landmarks.positions;
        //console.log(predictions[2])
        //drawResult(result.landmarks.positions)
    }
    
    rafID = requestAnimationFrame(renderPrediction);
  }
async function run() {

    //await faceapi.loadFaceLandmarkModel('/weights')
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/weights')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/weights')
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/weights')
    await faceapi.nets.tinyFaceDetector.loadFromUri('/weights')
    

    // try to access users webcam and stream the images
    // to the video element
    await setupCamera();
    video.play();
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;
    renderPrediction();
  }
(function() {
    run();
 })();
