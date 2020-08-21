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

## For developers
If you want to develope this program, there are some tips I want to share with you.

### Compile script
probably you change some things in the program and you want to create distribution files and update documents that are created from JSDocs.

Just run compile script:

```npm run compile```

## License
Released under the [Apache license 2.0](LICENSE.md)
