var w1 = window.innerWidth -5;
var h1 = window.innerHeight -5;

/** GRID **/
let cols, rows, scl;
let terrain;
let flying = 0;
let mouthOpenedp5;
let starSpeed;

let myFont;
function preload() {
  myFont = loadFont('stylesheets/aktiv-grotesk-w01.ttf');
}
class Star {
    constructor() {
        this.x = random(-height/2,height/2);
        this.y = random(-height/2, 0);
        this.z1 = random(0 , height/2);
    }

    updateStar = function(){
        if(starSpeed)this.z1 = this.z1-starSpeed;
        else this.z1 = this.z1-1;

        //console.log(starSpeed);

        if(this.z1 < 0) {
            this.z1 = height/2;
            this.x = random(-width/2,width/2);
            this.y = random(- height/2, 0);
        }
    }
    show = function(){
        fill(255); noStroke();

        let sx = map( this.x / this.z1, 0, 1, 0, width/2);
        let sy = map( this.y / this.z1, 0, 1, 0, height/2);

        //console.log("sx: " , sx, "sy: ", sy)

        let r = map(this.z1, 0, height/2, 6, 0);

        ellipse(sx, sy, r,r);
    }
}

let stars = [];


function setup() {
    createCanvas(w1, h1, WEBGL); textFont(myFont);
    scl = 30;
    cols = Math.ceil(w1 /scl);
    rows = Math.ceil((9*h1/10) /scl) ;
    console.log("cols: " , cols, " rows: " , rows)
    terrain = Array.from(Array(cols), () => new Array(rows));

    for (var i = 0; i< 80; i++){
        stars[i] = new Star();
    }
}

function draw() {
    background(0); stroke(255); noFill();
    if(starSpeed) flying -= map(starSpeed, 1, 10, 0.01 , 0.03 );
    else flying +=-0.02;
    let yoff = flying;
    for(var y = 0; y< rows; y++){
        let xoff = 0;
        for(var x = 0; x<cols; x++){
            if(mouthOpenedp5) terrain[x][y] = map(noise(xoff, yoff), 0, 1, -mouthOpenedp5, mouthOpenedp5);
            else terrain[x][y] = map(noise(xoff, yoff), 0, 1, -50, 50);
            xoff += 0.12;
        }
        yoff += 0.12;
    }

    push();
    translate(-w1/2, h1/6, 0);
    rotateX(PI/2);
    for (var y = 0; y< rows-1; y++){
        beginShape(QUAD_STRIP);
        for(var x = 0; x < cols; x++){
            vertex(x*scl, y*scl, terrain[x][y]);
            vertex(x*scl, (y+1)*scl, terrain[x][y+1]);
            vertex(x*scl, y*scl, terrain[x][y]);
        }
        endShape();
    }
    pop();
    //fill('#ED225D');
    if(predictionsGlobal.length > 1){
        /* opened mouth */
        var a = predictionsGlobal[66].x - predictionsGlobal[62].x;
        var b = predictionsGlobal[66].y - predictionsGlobal[62].y;

        mouthOpenedp5 = Math.sqrt( a*a + b*b );
        starSpeed = map(mouthOpenedp5, 1, 45, 1 , 10 );
        mouthOpenedp5 = map(mouthOpenedp5, 5, 45, 40 , 80 );

        //console.log("sd")
        /*push();
        translate(0, -h1/1.5, 0);
        for(var i = 0; i<predictionsGlobal.length; i++){
            //text(i.toString(), predictionsGlobal[i].x, predictionsGlobal[i].y);
            circle(predictionsGlobal[i].x, predictionsGlobal[i].y, 2 )
        }
        pop();*/

    }
    

    /*starfield */
    for (var i = 0; i <stars.length; i++){
        stars[i].updateStar();
        stars[i].show();
    }
}

