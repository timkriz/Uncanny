var w1 = window.innerWidth -5;
var h1 = window.innerHeight -5;

/** GRID **/
let cols, rows, scl;
let terrain;
let flying = 0;
let mouthOpenedp5;
let starSpeed;
let gridIsWhite = 1;

let myFont;
function preload() {
  myFont = loadFont('stylesheets/aktiv-grotesk-w01.ttf');
}
class Star {
    constructor() {
        this.x = random(-height/2,height/2);
        this.y = random(-height/2, 0);
        this.z1 = random(0 , height/2);
        this.userGenerated = 0
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
        //fill(255); noStroke();

        let sx = map( this.x / this.z1, 0, 1, 0, width/2);
        let sy = map( this.y / this.z1, 0, 1, 0, height/2);

        let r = 6;
        //console.log("sx: " , sx, "sy: ", sy)
        if(this.userGenerated == 0){
           r = map(this.z1, 0, height/2, 6, 1); 
        }
        else{
           r = 6
        }
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
function mouseClicked() {

    /* AUDIO */
    if(gridIsWhite == 1){
        /*if(document.getElementById('audiotag2').currentTime>0){
            document.getElementById('audiotag2').play();
        }
        else{*/
        document.getElementById('audiotag2').play();
        //document.getElementById('audiotag2').currentTime = 0;
        
        /* Grid colors */
        gridIsWhite = 0;
    }
    else{
        document.getElementById('audiotag2').pause();
        //document.getElementById('audiotag2').currentTime = 0;
        /* Grid colors */
        gridIsWhite = 1;
    }
    /*let newStar = new Star();
    //if(mouseX < width/2) mappedX = mouseX - width/2
    //if(mouseX >= width/2) mappedX = -mouseX
    //mappedX = map(mouseX , 0, width, -width/2, +width/2);
    //mappedY = map(mouseY , 0, height, -height/2, +height/2);

    mappedX = mouseX - width/2
    mappedY = mouseY - height/2

    newStar.x = mappedX 
    newStar.y = mappedY
    newStar.z1 =  height/2-50
    newStar.userGenerated = 1;
    stars.push(newStar)
    console.log("mouseX: ", mouseX, "mouseY: ",mouseY)
    console.log(mappedX, mappedY)*/
}
function draw() {
    background(0); noFill();
    /* Determine color of grid */
    if(predictionsGlobal.length > 1) {
        mappedXcoordCol = map(predictionsGlobal[30].x, 1, 500, 160, 360);
        mappedYcoordCol = map(predictionsGlobal[30].y, 1, 500, 50, 90);
    }
    else {
        mappedXcoordCol = map(mouseX, 0, w1, 160, 360);
        mappedYcoordCol = map(mouseY, 0, h1, 50, 90);
    }
    //console.log("Hue: " , String(Math.round(mappedXcoordCol)), "Saturation: ", String(Math.round(mappedYcoordCol)))

    if(gridIsWhite) {stroke(255); fill(255)}
    else{
        stroke(color('hsl('+String(Math.round(mappedXcoordCol)) +', '+String(Math.round(mappedYcoordCol)) +'%, 67%)'));
        fill(color('hsl('+String(Math.round(mappedXcoordCol)) +', '+String(Math.round(mappedYcoordCol)) +'%, 67%)'))
    } 


    if(starSpeed) flying -= map(starSpeed, 1, 10, 0.01 , 0.03 );
    else flying +=-0.02;

    let yoff = flying;
    mappedYmouse = map(mouseY, 0, h1, 30, 70);
    mappedYmouse = 30+70-mappedYmouse;
    //console.log(document.getElementById('audiotag2').currentTime)
    for(var y = 0; y< rows; y++){
        let xoff = 0;
        for(var x = 0; x<cols; x++){

            if(document.getElementById('audiotag2').currentTime >28 && gridIsWhite == 0) {
                //console.log(mouseY)
                //mappedYmouse = map(mouseX, 0, h1, -50, 50);
                //console.log(mouseX)
                terrain[x][y] = map(noise(xoff, yoff), 0, 1, -80, 80);
            }
            else terrain[x][y] = map(noise(xoff, yoff), 0, 1, -40, 40);
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


    /* Text box */
    //fill('#BBBBBB'); noStroke(); 
    //rect(w1/2 -100, -h1/2, 27, h1);
    verticalText("Click somewhere", -w1/2 +40, -h1/2 +10);
    verticalText("Mouth is speed", w1/2 -60, -h1/2 +10);
    verticalText("Head position is color", w1/2 -40, -h1/2+10);

}

function verticalText(input, x, y) {
  var output = "";  // create an empty string
 
  for (var i = 0; i < input.length; i += 1) {
    output += input.charAt(i) + "\n"; // add each character with a line break in between
  }
 
  push(); // use push and pop to restore style (in this case the change in textAlign) after displaing the text 
  textAlign(CENTER, TOP); // center the characters horizontaly with CENTER and display them under the provided y with TOP
  text(output, x, y); // display the text
  pop();
}