"use strict";

/*
 * Initializing
 */

var cd = new CanvasDrawer({
    'id': 'c',
    'errorFunction': function(){alert("Error!")},
    'cartographer': true
});

let drawer = cd.drawer;
var positionMaker = new PositionMaker();



// Test

// let imageA = new Image(); 
// imageA.onload = function(){

//     cd.loadTexture(imageA, 0);

//     cd.drawer.setUseTexture(0);
//     cd.drawer.setTextureEnable();
//     cd.drawer.setTextureResolution(512, 512);
//     cd.positionMaker.addPolygon([0,0, 256,0, 256,256, 0,256]);
//     cd.justDraw(1,0,0,1);

//     cd.drawer.setColorEnable();
//     cd.positionMaker.addCircle(250,250,50,15);
//     cd.draw(1,0,0,1);

// }
// imageA.src = 'images/b.jpg';


let callback = function(data){
    cd.drawer.setTextureEnable();
    cd.drawer.setTextureResolution(512, 512);
    cd.drawer.setUseTexture(0);
    cd.positionMaker.addPolygon([0,0, 256,0, 256,256, 0,256]);
    cd.justDraw();

    cd.drawer.setUseTexture(1);
    cd.positionMaker.addPolygon([128,128, 512,128, 512,512, 128,512]);
    cd.justDraw();

    cd.drawer.setColorEnable();
    cd.positionMaker.addCircle(250,250,50,15);
    cd.draw(1,0,0,1);
}

let textures = [
    'images/a.jpg', 
    'images/b.jpg'
];

cd.loadMultiImageToTextures(textures, callback);


/*
 * Data Insertion
 */
// function rnd(){
//     return Math.floor(Math.random() * 400) + 50;
// }

// cd.positionMaker.addCircle(100,100,50,15);
// cd.draw(1,0,0,1);

// //red
// for(let i = 0; i< 5;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(1,0,0,1);

// //blue
// for(let i = 0; i< 5;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(0,0,1,1);

// //yellow
// for(let i = 0; i< 5;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(1,1,0,1);