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
let imageA = new Image(); imageA.src = 'images/b.jpg';
imageA.onload = function(){
    cd.loadTexture(imageA);
}

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