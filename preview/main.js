"use strict";

/*
 * Initializing
 */
var cd = new CanvasDrawer({
    'id': 'c',
    'errorFunction': ()=>alert("Error!"),
    'cartographer': true
});

// Test
let textures = [
    'images/a.png', 
    'images/b.jpg'
];

cd.loadTextures(textures, (data) => {
    cd.drawer.setTextureEnable();
    cd.drawer.enableBlending(); // Transparent Textures
    
    cd.drawer.setTextureResolution(512, 512);
    cd.drawer.setUseTexture(data['images/a.png']);
    cd.addPolygon([0,0, 256,0, 256,256, 0,256]);
    cd.justDraw();

    cd.drawer.setTextureUserTranslation(128, 128);
    cd.drawer.setTextureResolution(768, 768);
    cd.drawer.setUseTexture(data['images/b.jpg']);
    cd.addPolygon([128,128, 512,128, 512,512, 128,512]);
    cd.justDraw();

    cd.drawer.setColorEnable();
    cd.addCircle(250,250,50,15);
    cd.draw(1,0,0,1);
});


/*
 * Data Insertion
 */
// function rnd(){
//     return Math.floor(Math.random() * 400) + 50;
// }

// cd.positionMaker.addCircle(100,100,50,15);
// cd.draw(1,0,0,1);

// //red
// for(let i = 0; i< 70000;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(1,0,0,1);

// //blue
// for(let i = 0; i< 10000;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(0,0,1,1);

// //yellow
// for(let i = 0; i< 5000;i ++) {
//     cd.positionMaker.addPolygon([rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()]);
// }
// cd.draw(1,1,0,1);