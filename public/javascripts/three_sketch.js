
let canvasSwitch = 0;

let clock;

var camera3, scene, renderer, composer;
var width3, height3;
let headPosition = new THREE.Vector3( 0, -60, -500 );
let animatedMesh; let animatedMeshEyes; let modelHead;

var ambientLight;
var colorLight;
var hueHead = 0;

let mouthOPEN;
let headROLL;

/* Storyline variables */
let modelInSceneSwitch = 0;
let uncannyStarting = 1;
let boxTextMesh;
let button1, button2, button3;
let toggleVideoEl = 0;
let toggleAudioEl = 0;
let toggleTravelTransition = 0;
let switchToTravelPage = 0;

let facePositions1;
let faceDotsArray = [];
let faceDotsArrayLeft = [];

const animate = function () {
    requestAnimationFrame( animate );
    if(predictionsGlobal.length>1 && !modelInSceneSwitch) {
        scene.add( modelHead ); 
        modelInSceneSwitch = 1;
    }
    if(modelInSceneSwitch && boxTextMesh){
        boxTextMesh.scale.multiplyScalar(1.008);
        if(boxTextMesh.scale.x > 3) {
            scene.remove(boxTextMesh); 
            boxTextMesh = 0;
            scene.add(button1);scene.add(button2);scene.add(button3);
        }
    }
    if(animatedMesh && predictionsGlobal.length>1){
        /* opened mouth */
        var a = predictionsGlobal[66].x - predictionsGlobal[62].x;
        var b = predictionsGlobal[66].y - predictionsGlobal[62].y;

        var mouthOPEN = Math.sqrt( a*a + b*b );
        mouthOPEN = scaleCus(mouthOPEN, 5, 45, 0 ,1 );
        mouthOPEN = (Math.round(mouthOPEN * 1000) / 1000);
        if(mouthOPEN<0.2) mouthOPEN =0;
        animatedMesh.morphTargetInfluences[0] = mouthOPEN;

        /* head rotation */
        var slope = (predictionsGlobal[16].y - predictionsGlobal[1].y) / (predictionsGlobal[16].x - predictionsGlobal[1].x);
        slope = (Math.round(slope * 1000) / 1000)+0.1;
       
        if(slope<=0.7 && slope>=-0.7) {
            if(slope<=0.1 && slope>=-0.1) slope =0;
            animatedMesh.rotation.y = slope;
            animatedMeshEyes.rotation.y = slope;
        }

        if(toggleTravelTransition) {
            animatedMesh.rotation.z += 0.005
            animatedMeshEyes.rotation.z += 0.005
            animatedMesh.scale.x *= 1.01; animatedMesh.scale.y *= 1.01; animatedMesh.scale.z *= 1.01
            animatedMeshEyes.scale.x *= 1.01; animatedMeshEyes.scale.y *= 1.01; animatedMeshEyes.scale.z *= 1.01

            if(animatedMesh.rotation.z > 0.9 && switchToTravelPage == 0) {
                window.location.href = "/travel";
                switchToTravelPage = 1;
            }
        }
    
        /* eyebrows */
        var a = predictionsGlobal[38].x - predictionsGlobal[20].x;
        var b = predictionsGlobal[38].y - predictionsGlobal[20].y;

        var browsOPEN = Math.sqrt( a*a + b*b );
        browsOPEN = scaleCus(browsOPEN, 18, 35, 0 ,1 );
        browsOPEN = (Math.round(browsOPEN * 1000) / 1000);
        animatedMesh.morphTargetInfluences[1] = browsOPEN;

        /* draw prediction on video elements */
        if(toggleVideoEl) {
            facePositions1 = predictionsGlobal;
            drawDotsOnVideoEl();
        }
    }
    if(boxTextMesh){
        boxTextMesh.rotation.y += 0.008
    }

    materialTEXTINTRO.uniforms.uTime.value = clock.getElapsedTime();

    renderer.clear();
    
    camera3.layers.set(0);
    composer.render();

    renderer.clearDepth();
    camera3.layers.set(1);
    renderer.render(scene, camera3);
};

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    //var width, height;
    width3 = window.innerWidth;height3 =  window.innerHeight;
    camera3 = new THREE.OrthographicCamera( width3 / - 2, width3 / 2, height3 / 2, height3 / - 2, -1, 1000 );    
    
    renderer.setSize( width3, height3 );
}

function setupThree(){
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true,   precision:'highp', localClippingEnabled: true } );
    renderer.autoClear = false;
    onWindowResize();
    document.body.appendChild( renderer.domElement );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    /* Camera */
    camera3.position.z = 5; camera3.layers.enable(1);
    scene.add( camera3 );

    /* Lights */
    ambientLight = new THREE.AmbientLight( 0xA0A0A0 ); // soft white light
    scene.add( ambientLight );
    colorLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    colorLight.position.set(500,250,1)
    scene.add( colorLight );

    /* Glow effect */
    composer = new THREE.EffectComposer( renderer )
    composer.setSize( window.innerWidth, window.innerHeight )

    renderScene = new THREE.RenderPass( scene, camera3 );
    composer.addPass( renderScene );

	bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = 0.1
    bloomPass.strength = 0.25
    bloomPass.radius = 0.8
    bloomPass.renderToScreen = true
        
    composer.addPass( bloomPass );

    /* Timer */
    clock = new THREE.Clock();

    startIntro();

    for(var i = 0; i< 68; i++){
        var geometry = new THREE.CircleBufferGeometry( 1.1, 5 );
        var dotMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee} );
        var dot1 = new THREE.Mesh( geometry, dotMaterial );
        var dot2 = new THREE.Mesh( geometry, dotMaterial );
        dot1.layers.set(1);dot2.layers.set(1);
        faceDotsArray.push(dot1);
        faceDotsArrayLeft.push(dot2)
    }

    drawBackDots();
    drawButtons();
    loadFaceModel();
}

function init() {
    setupThree();
    animate();
}
init();

function onDocumentMouseDown( e ) {
    e.preventDefault();
    canvasSwitch = 1;
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    mouse.x = ( e.clientX / width3 ) * 2 - 1;
    mouse.y = - ( e.clientY / height3 ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera3 );
    var intersects = raycaster.intersectObjects([button1, button2, button3]);

    if (intersects.length > 0) {
        var firstIntersectedObject  = intersects[0];
        if(toggleAudioEl == 0){
            if(firstIntersectedObject.object.name == "button1") {
                toggleAudioEl = 1;
                document.getElementById('audiotag1').play();
                scene.getObjectByName("button1").material.color = new THREE.Color( 0x44CCFF );
            }
        }
        else {
            if(firstIntersectedObject.object.name == "button1") {
                toggleAudioEl = 0;
                document.getElementById('audiotag1').pause();
                document.getElementById('audiotag1').currentTime = 0;
                scene.getObjectByName("button1").material.color = new THREE.Color( 0xFFFFFF );
            }
        }
        if(toggleVideoEl == 0){
            if(firstIntersectedObject.object.name == "button2") {
                toggleVideoEl = 1;
                drawVideoElement();
                scene.getObjectByName("button2").material.color = new THREE.Color( 0x44CCFF );
                if(faceDotsArray){
                    for(var i = 17; i< faceDotsArray.length; i++){
                        scene.add( faceDotsArray[i] );
                        scene.add(faceDotsArrayLeft[i]);
                    }
                }
            }
        }
        else {
            if(firstIntersectedObject.object.name == "button2"){
                toggleVideoEl = 0;
                scene.getObjectByName("button2").material.color = new THREE.Color( 0xFFFFFF );
                var selectedObject1 = scene.getObjectByName("videoObject1");
                //var selectedObject2 = scene.getObjectByName("videoObject2");
                //if(selectedObject1 && selectedObject2)
                if(selectedObject1){
                    scene.remove( selectedObject1 );
                    //scene.remove( selectedObject2 );
                    /* DOTS OVER VIDEO EL */
                    for(var i = 17; i< faceDotsArray.length; i++){
                        scene.remove( faceDotsArray[i] );
                        //scene.remove(faceDotsArrayLeft[i]);
                    }
                }
            }
        }
        if(firstIntersectedObject.object.name == "button3") {
            toggleTravelTransition = 1;
            scene.getObjectByName("button3").material.color = new THREE.Color( 0x44CCFF );
            //window.location.href = "/travel";
        }
    }
}
function drawButtons(){
    //button1
    var geometry = new THREE.CircleBufferGeometry( 8, 16 );
    button1 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    button1.position.set(-50, -5*height3/12, -500);
    button1.layers.set(0);button1.name = "button1";
    //button2
    var geometry = new THREE.CircleBufferGeometry( 8, 16 );
    button2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    button2.position.set(00, -5*height3/12, -500);
    button2.layers.set(0); button2.name = "button2";
    //button3
    var geometry = new THREE.CircleBufferGeometry( 8, 16 );
    button3 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    button3.position.set(50, -5*height3/12, -500);
    button3.layers.set(0);button3.name = "button3";
}

var positionX;
var positionY;
function drawBackDots() {
    var blackDots = [];
    var step = Math.ceil((width3 - width3/3)/40);
    var rows = Math.ceil(height3/step);
    var cols = Math.ceil(width3/step);


    for (var x = 0; x < cols; x++) {
        for(var y = 0; y<rows; y++){
            positionX = (step * x) - (width3)/2;
            positionY = (step*y)-height3/2;
            var geometry = new THREE.CircleBufferGeometry( 1.5, 16 );
            geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(positionX, positionY, -900) );
            blackDots.push(geometry);
        }
    }
    var geometriesDots = THREE.BufferGeometryUtils.mergeBufferGeometries(blackDots);

    var mesh = new THREE.Mesh(geometriesDots, new THREE.MeshBasicMaterial({ color: 0x999999} ));
    mesh.layers.set(0);
    scene.add(mesh);
}

function drawVideoElement(){
    var video = document.getElementById('video');
    var texture = new THREE.VideoTexture(video);
    texture.needsUpdate;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.LuminanceFormat;
    texture.crossOrigin = 'anonymous';
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.x = - 1;
    
    /* right */
    var imageObject1 = new THREE.Mesh(
        new THREE.PlaneGeometry(250, 250),
        new THREE.MeshBasicMaterial({ map: texture }),);
    imageObject1.position.set(width3/2 - 200, 0, -900);
    imageObject1.layers.set(1);
    imageObject1.name= "videoObject1";

    /* border */
    var border1 = new THREE.Mesh(
        new THREE.PlaneGeometry(253, 253),
        new THREE.MeshBasicMaterial({ color: 0xdddddd }));
    border1.position.set(width3/2 - 200, 0, -901);
    imageObject1.attach(border1);
    scene.add( imageObject1 );
}
function drawDotsOnVideoEl(){
    for(var i = 17; i< faceDotsArray.length; i++){
        var positionX = predictionsGlobal[i].x;
        /*mirror*/
        positionX = positionX-250;
        positionX = positionX*-1;
        var positionY = -predictionsGlobal[i].y + 250;
        positionX = positionX*0.5; positionY = positionY*0.5;
        positionX1 = positionX+ ((width3/2) - 200);
        faceDotsArray[i].position.set(positionX1, positionY, -100);
    }
}

function startIntro(){
    
    const boxGeo = new THREE.BoxBufferGeometry( 500, 200, 500 );
    //const boxGeo = new THREE.CylinderBufferGeometry( 300, 300, 800, 8 );
    const texture = new THREE.TextureLoader().load('/images/text_texture2.png', (texture) =>
        {
            texture.minFilter = THREE.NearestFilter;
        });
    materialTEXTINTRO= new THREE.ShaderMaterial({
        vertexShader: vShader1,
        fragmentShader: fShader1,
        uniforms:{
            uTime: { value: 0.0 },
            uTexture: { value: texture }
        },
        transparent: true,
        side: THREE.DoubleSide
    });

    boxTextMesh = new THREE.Mesh(boxGeo, materialTEXTINTRO);
    boxTextMesh.position.set(0, 0, -500);
    //boxTextMesh.layers.set(0);
    scene.add(boxTextMesh);
   
}


// GLTF MODEL
function loadFaceModel(){
    const loader = new THREE.GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        '3Dmodels/alenka3.gltf',
        // called when the resource is loaded
        function ( gltf ) {
            modelHead = gltf.scene;
            modelHead.layers.set(0);
            modelHead.scale.set(25,25, 25); // scale here
            modelHead.position.set(headPosition.x, headPosition.y, headPosition.z);
            animatedMesh = modelHead.children[0].children[2].children[0];
            animatedMeshEyes = modelHead.children[0].children[2].children[1];
            animatedMesh.layers.set(0);
            modelHead.layers.set(0);
            //scene.add( modelHead );
        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

const scaleCus = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }