/**
 * Get info object and set values.
 * 
 * @param {Object} info 
 * @param {string} info.id id of canvas element
 * @param {function} info.errorFunction callback function for when user cannot use webgl
 * @param {boolean} info.isCartographerEnable value is True when you want zoomin/out and translation with mouse
 * @param {float} info.zoomInRate zoomin rate default:1.1 (just if isCartographerEnable enabled)
 * @param {float} info.zoomOutRate zoomout rate default:0.9 (just if isCartographerEnable enabled)
 */
function CanvasDrawer(info){
    /**
     * Get value of a specific key. If key not found in ``this.info`` object
     * then returns defaultValue.
     * 
     * @param {string} name key name
     * @param {*} defaultValue value
     * @returns {*} value of key
     */
    this.loadDataFromInfo = function(name, defaultValue) {
        return (name in this.info) ? this.info[name] : defaultValue;
    };


    /**
     * Draw shapes that are added to the Position Maker with a specific 
     * color and reset the Position Maker.
     * 
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.draw = function(r, g, b, a){
        this.drawer.draw(this.positionMaker.positions, r, g, b, a);
        this.positionMaker.reset();
    }

    /**
     * Draw shapes that are added to the Position Maker and reset that.
     */
    this.justDraw = function(){
        this.drawer.justDraw(this.positionMaker.positions);
        this.positionMaker.reset();
    }

    /**
     * Call Drawer.setTexture(image, slut)
     * 
     * @param {Image} image 
     * @param {*} slut 
     */
    this.loadTexture = function(image, unit){
        this.drawer.setTexture(image, unit);
    }

    /**
     * Get an array of loaded Image objects and load them to texture
     * units. When done calls the callback function with an associative
     * array that maps image.idName to texture unit.
     * 
     * @param {Image[]} images array of loaded Image objects with idName attr.
     * @param {function} callback callback function
     */
    this.imagesLoadTexture = function(images, callback=(imagesToTextureMap)=>{}){
        var imageLoadUnit = 0;
        var imagesToTextureMap = [];
        var maximumTextureUnits = this.drawer.getMaximumTextureUnits();

        images.forEach(async (image) => {
            let unit = imageLoadUnit;
            imageLoadUnit ++;
            imagesToTextureMap[image.idName] = unit >= maximumTextureUnits ? -1 : unit;
            this.loadTexture(image, unit);
        });

        callback(imagesToTextureMap);
    }

    /**
     * This function will accept an array of some images path and load 
     * them to texture units. When all images are loaded to texture units 
     * then calls the callback function.
     * 
     * @param {string[]} imagesList array of images path
     * @param {function} callback callback function
     */
    this.loadTextures = function(imagesList, callback=()=>{}){
        var imagesLoaded = 0;
        var imagesCount = imagesList.length;
        var imagesObjects = [];

        var imagesLoadTexture = (images) => {
            this.imagesLoadTexture(images, callback);
        }

        imagesList.forEach((imageUrl) => {
            let image = new Image();
            image.idName = imageUrl;
            imagesObjects.push(image);
            image.onload = () => {
                imagesLoaded ++;
                if(imagesLoaded == imagesCount){
                    imagesLoadTexture(imagesObjects);
                }
            };
            image.src = imageUrl;
        });
    }


    // Constructor
    /**
     * Constructor function. Get info object and set values.
     * 
     * @param {Object} info 
     * @param {string} info.id id of canvas element
     * @param {function} info.errorFunction callback function for when user cannot use webgl
     * @param {boolean} info.isCartographerEnable value is True when you want zoomin/out and translation with mouse
     * @param {float} info.zoomInRate zoomin rate default:1.1 (just if isCartographerEnable enabled)
     * @param {float} info.zoomOutRate zoomout rate default:0.9 (just if isCartographerEnable enabled)
     */
    this.constructor = function(info){
        this.info = info;

        var id = this.loadDataFromInfo('id', false);
        var errorFunction = this.loadDataFromInfo('error', function(){});
        var isCartographerEnable = this.loadDataFromInfo('cartographer', false);
        var zoomInRate = this.loadDataFromInfo('zoominrate', 1.1);
        var zoomOutRate = this.loadDataFromInfo('zoomoutrate', 0.9);

        if(id === false){
            console.log("CanvasDrawer can not found element with id that you pass or maybe you don't pass any id!");
            return;
        }

        // Set Drawer
        this.drawer = new Drawer(id, errorFunction);

        // Set Cartographer
        if(isCartographerEnable){
            let drawer = this.drawer;

            var setReativeTranslation = function(rx, ry, px, py, tpx, tpy){
                drawer.setTextureTranslation(tpx + rx, tpy + ry);
                drawer.updateTranslation(px + rx, py + ry);
            }

            var getPinPoint = function(){
                return drawer.translation;
            }

            var getTexturePinPoint = function(){
                return drawer.texTranslation;
            }

            var zoominAction = function (x,y) {
                let scale = drawer.scale[0];
                drawer.updateScaleIntoPoint(scale * zoomInRate,x,y);
            }

            var zoomoutAction = function (x,y) {
                let scale = drawer.scale[0];
                drawer.updateScaleIntoPoint(scale * zoomOutRate,x,y);
            }

            this.cartographer = new Cartographer(id, setReativeTranslation, getPinPoint, getTexturePinPoint, zoominAction, zoomoutAction);
        }

        // Set Position Maker
        this.positionMaker = new PositionMaker();
    }


    // Main
    this.constructor(info);

    /**
     * Get array of values and add represented polygon to ``Position Maker``.
     * 
     * @param {number[]} vertices sequence of ``X``s and ``Y``s of vertices of polygon. For example ``[0,0, 50,0, 50,50, 0,50]`` represents an square
     */
    this.addPolygon = (vertices)=>this.positionMaker.addPolygon(vertices);
    
    
    /**
     * Add a line between ``P1`` and ``P2`` to ``Positon Maker``.
     * 
     * @param {number} x1 X of P1
     * @param {number} y1 Y of P1
     * @param {number} x2 X of P2
     * @param {number} y2 Y of P2
     * @param {number} width width of line
     */
    this.addLine = (x1,y1,x2,y2,width)=>this.positionMaker.addLine(x1,y1,x2,y2,width);
    
    /**
     * Add a circle ``Positon Maker`` that centered on ``P`` with radius of ``R``.
     * @param {number} cx X of P
     * @param {number} cy Y of P
     * @param {number} r radius
     * @param {integer} cuts number of triangles to draw circle
     */
    this.addCircle = (cx,cy,r,cuts=15)=>this.positionMaker.addCircle(cx,cy,r,cuts=15);
    
    /**
     * Add multiple lines to ``Position Maker``
     * @param {number[]} positions sequence of vetices of line. For example ``[0,0, 100,0, 100,50]`` represents an L shape line
     * @param {number} width line width
     */
    this.addSequenceLine = (positions, width)=>this.positionMaker.addSequenceLine(positions, width);
}