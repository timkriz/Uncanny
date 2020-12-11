let canvasSwitch = 0;

var camera3, scene, renderer;
var width3, height3;
let headPosition = new THREE.Vector3( 0, -40, -500 );
let animatedMesh; let animatedMeshDiv;

var ambientLight;
var colorLight;
var hueHead = 0;

let mouthOPEN;
let headROLL;

const scaleCus = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

const animate = function () {
    if(canvasSwitch == 0) requestAnimationFrame( animate );
    if (canvasSwitch == 1) {
        var elText1 = document.getElementById("text1"); 
        var elText2 = document.getElementById("text2");  // Get the <ul> element with id="myList"
        elText1.remove();
        elText2.remove();
        document.body.removeChild( renderer.domElement );

        var y =document.createElement('script');
        y.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js";
        document.body.appendChild(y)
        var x = document.createElement("script");
        x.src = "javascripts/sketch.js";
        document.body.appendChild(x)
    }
    /*
    if(colorLight) {
       if(hueHead>=1) hueHead =0;
       else hueHead += 0.001;
       colorLight.color.setHSL( hueHead, 0.8, 0.5 ); 
       //ambientLight.color.setHSL( hueHead, .8, 0.5 ); 
    }*/

    if(animatedMesh && predictionsGlobal.length>1){
        //console.log(animatedMesh)

        /* opened mouth */
        var a = predictionsGlobal[66].x - predictionsGlobal[62].x;
        var b = predictionsGlobal[66].y - predictionsGlobal[62].y;

        var mouthOPEN = Math.sqrt( a*a + b*b );
        mouthOPEN = scaleCus(mouthOPEN, 5, 45, 0 ,1 );
        animatedMesh.morphTargetInfluences[0] = mouthOPEN;

        /* head rotation */
        var slope = (predictionsGlobal[16].y - predictionsGlobal[1].y) / (predictionsGlobal[16].x - predictionsGlobal[1].x);
        animatedMesh.rotation.y = slope;
        //animatedMeshDiv.rotation.y = slope;
    }
    renderer.render( scene, camera3 );
};

window.addEventListener( 'resize', onWindowResize, false );
/*window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth/4, window.innerHeight/2);
    //render();
}, false);*/

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
    onWindowResize()
    document.body.appendChild( renderer.domElement );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    camera3.position.z = 5;

    scene.add( camera3 );
    /* LIGHTS */
    ambientLight = new THREE.AmbientLight( 0xA0A0A0 ); // soft white light
    scene.add( ambientLight );
    colorLight = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add( colorLight );

    /*let geo = new THREE.BoxBufferGeometry(50,50,50);
    let mat = new THREE.MeshBasicMaterial();
    let mesh1 = new THREE.Mesh(geo, mat);
    mesh1.position.set(0,0,-500);
    scene.add(mesh1);*/
    
    drawBackDots();
    loadFaceModel();
}

function init() {
    setupThree();
    animate();
}
init();

function onDocumentMouseDown( e ) {
    //triggerSwitch();
    canvasSwitch = 1;
}


function drawBackDots() {
    var step = Math.ceil((width3 - width3/3)/50);
    var rows = Math.ceil(height3/step);
    var cols = 50 +1;

    //console.log("ros . " , rows)
    for (var x = 0; x < cols; x++) {
        for(var y = 0; y<rows; y++){
            var geometry = new THREE.CircleBufferGeometry( 1.5, 16 );
            var material = new THREE.MeshBasicMaterial( { color: 0xababab } );
            var circle = new THREE.Mesh( geometry, material );
            circle.position.set((step * x) - (width3 - width3/3)/2, (step*y)-height3/2, -900);
            scene.add( circle );         
        }
    }
}





/*
const loader = new THREE.FontLoader();

loader.load( '/stylesheets/AktivGrotesk.json', function ( font ) {

	const geometry = new THREE.TextBufferGeometry( 'Hello three.js!', {
		font: font,
		size: 10,
		height: 1
    } );
    const material = new THREE.MeshBasicMaterial( { color:  0xababab } );
    scene.add(new THREE.Mesh(geometry, material));
} );

*/




// GLTF MODEL
function loadFaceModel(){
    const loader = new THREE.GLTFLoader();
    // Load a glTF resource
    loader.load(
        // resource URL
        '3Dmodels/alenka2.gltf',
        // called when the resource is loaded
        function ( gltf ) {
            let modelHead = gltf.scene;

            modelHead.scale.set(25,25, 25); // scale here
            modelHead.position.set(headPosition.x, headPosition.y, headPosition.z);
            /*take care of divider */
            /*animatedMeshDiv = modelHead.children[0].children[1];
            animatedMeshDiv.material = new THREE.MeshBasicMaterial({color: '#000'});*/
            
            console.log(modelHead);
            animatedMesh = modelHead.children[0].children[1];
            var matt = new THREE.MeshStandardMaterial({color: '#c0c0c0', roughness: 0});

            matt.morphTargets=true;
            animatedMesh.material = matt;
            
            scene.add( modelHead );

            /* back head */
            var geometry = new THREE.CircleBufferGeometry(200, 16 );
            var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
            var circle = new THREE.Mesh( geometry, material );
            circle.scale.y = 1.3;
            circle.position.set(0,0, -800);
            scene.add( circle );      

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

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