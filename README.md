# Canvas Drawer
Minimal WebGL-based 2D visualization library 

## Read in other languages
- [Persian فارسی](docs/README.fa.md)

## What is it useful for?
- It is useful for those who want to draw shapes with some colors and textures on canvas.
- If you want to zoom in/out or move drawn data then Canvas Drawer provides this feature.
- The main purpose of this program is to visualization a huge amount of shapes that don't overlap with each other on canvas. If some of your data have overlap with each other then maybe you get in trouble with your view after zoom in/out or moving over shapes. However, if you don't use these features, there will be no problem.

## Requirements
This program uses these libraries:
- [Earcut](https://github.com/mapbox/earcut) for polygon triangulation
- [JQuery](https://github.com/jquery/jquery)

## Documents created by JSDocs
Documents of each file and each function of that can accessible from these links:

- [CanvasDrawer](docs/jsdoc/CanvasDrawer.md)
- [Cartographer](docs/jsdoc/Cartographer.md)
- [Drawer](docs/jsdoc/Drawer.md)
- [Historian](docs/jsdoc/Historian.md)
- [HistoryManager](docs/jsdoc/HistoryManager.md)
- [PositionMaker](docs/jsdoc/PositionMaker.md)

A lot of thanks to [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) for creating these files.

## How to use
Always we should add dependencies at first:
```
<script src="../node_modules/jquery/dist/jquery.min.js"></script>
<script src="../node_modules/earcut/src/earcut.js"></script>
```

Now we can add our program's script to the page:
```
<script src="../dist/CanvasDrawer.min.js"></script>
```

Now we are ready to draw on a ``<canvas>``. So we add a ``<canvas>`` to our page:
```
<canvas id="myCanvas" width="1000" height="700"></canvas>
``` 

### Initialization
It's so simple and beautiful!
```
var cd = new CanvasDrawer({
    'id': 'myCanvas',
    'errorFunction': ()=>alert("You can't load WebGL right now"),
    'cartographer': true
});
```
For more detailed information on how to enter information, you can refer to the [CanvasDrawer](docs/jsdoc/CanvasDrawer.md) documentation file. But I will explain some more important cases here:

value of `id` is equaled with the id attribute of our canvas element.

``ErrorFunction`` is a function that is called when it is not possible to load WebGL.

The ``cartographer`` receives a ``boolean`` value and Specifies zoom in/out and dragging be active or not.

### Drawing
I will explain the following commands step by step:
```
cd.loadTextures(textures, (data) => {
    cd.drawer.setTextureEnable();
    cd.drawer.setTextureResolution(512, 512);
    cd.drawer.setUseTexture(data['images/a.jpg']);
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
```

Here are some important points:
- ``cd.drawer`` is an ``Object`` that manages out interaction with WebGL.
- If we want to use any texture we should load that texture to one of the Texture Units. Any Texture Unit identified with a unique integer.

The ``cd.loadTextures( textures, data => {...} )`` function takes two values as input. The first one is the list of URLs for the images we want to use as Texture. The second one is a callback function that is called after all images have been loaded in units, and an associative array is passed as an argument to the function.

`` cd.drawer.setTextureEnable()`` specifies that the shape I am drawing now is supposed to have a texture. Also `` cd.drawer.setColorEnable()`` specifies that the shape I am drawing now is supposed to have a color.

The ``cd.drawer.setTextureResolution(512, 512)`` function specifies that the resolution of texture is 512x512.

``cd.drawer.setUseTexture(data['images/b.jpg'])`` specifies which Texture we want to use. `` data`` is a map from the URL of the texture file to the unit number where that texture was loaded.

``cd.addPolygon([0,0, 256,0, 256,256, 0,256])`` Triangulates a square with specified coordinates and keeps triangles coordinates in the memory.

``cd.just Draw`` draws all the triangles that are still in memory.

‍‍``cd.draw`` is similar to `` cd.justDraw`` except that we define what we want to draw to be red. The four input parameters of this function specify the values of r, g, b and a.

## For developers
If you want to develope this program, there are some tips I want to share with you.

### Compile script
probably you change some things in the program and you want to create distribution files and update documents that are created from JSDocs.

Just run compile script:

```npm run compile```

## License
Released under the [Apache license 2.0](LICENSE.md)
