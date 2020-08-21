/*!
 * Canvas Drawer v0.1.0
 * Minimal WebGL-based 2D visualization library
 * https://github.com/amiraslanaslani/Canvas-Drawer
 * 
 * Released under the Apache license 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Date: 2020-08-21T05:55:06.773Z (Fri, 21 Aug 2020 05:55:06 GMT)
 */

"use strict";

function HistoryManager(historian){

    this.historian = historian;

    // Color Attr.
    this.r = this.g = this.b = this.a = 1;
    
    //Texture Attr.
    this.t_slut = 0;
    this.t_resolution = [1, 1];
    this.t_translation = [0, 0];

    this.setColor = function(r, g, b, a){
        let key = "" + r + " " + g + " " + b + " " + a;
        this.historian.setKey(key);
    }

    this.updateTextureKey = function(){
        let key =   "#" + this.t_slut + 
                    ":" + this.t_resolution[0] + // Resolution W
                    ":" + this.t_resolution[1] + // Resolution H
                    ":" + this.t_translation[0] + // Translation X
                    ":" + this.t_translation[1]; // Translation Y

        this.historian.setKey(key);
    }

    this.setTextureSlut = function(slut){
        this.t_slut = slut;
        this.updateTextureKey();
    }

    this.setTextureResolution = function(w, h){
        this.t_resolution = [w, h];
        this.updateTextureKey();
    }

    this.setTextureTranslation = function(x, y){
        this.t_translation = [x, y];
        this.updateTextureKey();
    }

    this.submitVanilla = function(positions){
        this.historian.submitVanilla(positions);
    }

    this.forget = function(){
        return this.historian.forget();
    }

    this.getKeys = function(){
        return this.historian.getKeys();
    }

    this.getMemo = function(){
        return this.historian.getMemo();
    }

    // Constructor
    this.historian = historian;
}
"use strict";

function Historian(){
    this.memo = {};
    this.keys = [];
    this.key = "-1";

    this.submit = function(positions, key){
        if(! (key in this.memo)){
            this.keys.push(key);
            this.memo[key] = [];
        }
        
        this.memo[key] = this.memo[key].concat(positions);
    }

    this.submitVanilla = function(positions){
        this.submit(positions, this.key);
    }

    this.setKey = function(key){
        this.key = key;
    }

    this.forget = function(){
        this.memo = {};
        this.key = [];
    }

    this.getMemo = function(){
        return this.memo;
    }

    this.getKeys = function(){
        return this.keys;
    }
}
"use strict";

function Cartographer(id,setReativeTranslation, getPinPoint=function(){return [0,0]}, getTexturePinPoint=function(){return [0,0]}, zoominCallback=function(e){}, zoomoutCallback=function(e){}){
    var selector = $('#' + id);
    var clicked = false, clickY, clickX, scrollTopTmp, scrollLeftTmp;
    selector.css('cursor', 'grab');
    var pinPoint = [0,0];
    var texPinPoint = [0,0];

    var updateScrollPos = function(e) {
        let changeY = e.pageY - clickY;
        let changeX = e.pageX - clickX;
        setReativeTranslation(changeX, changeY, pinPoint[0], pinPoint[1], texPinPoint[0], texPinPoint[1]);
    }

    selector.on({
        'mousemove': function(e) {
            clicked && updateScrollPos(e);
        },
        'mousedown': function(e) {
            selector.css('cursor', 'grabbing');
            pinPoint = getPinPoint();
            texPinPoint = getTexturePinPoint();
            clicked = true;
            clickY = e.pageY;
            clickX = e.pageX;
            scrollTopTmp = selector.scrollTop();
            scrollLeftTmp = selector.scrollLeft();
        },
        'mouseleave': function() {
            clicked = false;
            selector.css('cursor', 'grab');
        },
        'mouseup': function() {
            clicked = false;
            selector.css('cursor', 'grab');
        }
    });

    selector.on("wheel mousewheel", function(e){
        e.preventDefault();
        let borderPosition = selector.position();
        if(e.originalEvent.deltaY > 0) {
            zoomoutCallback(
                e.pageX - borderPosition['left'],
                e.pageY - borderPosition['top']
            );
            return;
        } 
        if(e.originalEvent.deltaY < 0) {
            zoominCallback(
                e.pageX - borderPosition['left'],
                e.pageY - borderPosition['top']
            );
            return;
        }   
    });

}

"use strict";

function Drawer(id, webglErrorFunction){

    this.vertexShaderSource = `
        attribute vec2 a_position;
        uniform vec2 u_resolution;
        uniform vec2 u_scale;
        uniform vec2 u_translation;

        void main() {
            vec2 scaledPosition = a_position * u_scale;
            vec2 position = scaledPosition + u_translation;
            
            vec2 zeroToOne = position / u_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            clipSpace = clipSpace * vec2(1, -1);
            gl_Position = vec4(clipSpace, 0, 1);
        }
    `;

    this.fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;
        uniform sampler2D tex;
        
        uniform vec2 u_tex_resolution;
        uniform vec2 u_tex_translation;

        uniform int u_color_texture_flag;

        vec4  useColor(){
            return u_color;
        }

        vec4 useTexture(){
            mediump vec2 coord = vec2(gl_FragCoord.x, gl_FragCoord.y);
            vec2 position = vec2(coord.x - u_tex_translation.x, coord.y + u_tex_translation.y);
            vec2 zeroToOne = position / u_tex_resolution;
            vec2 zeroToTwo = zeroToOne * 2.0;
            vec2 clipSpace = zeroToTwo - 1.0;
            clipSpace = clipSpace * vec2(1, -1);
            mediump vec4 sample = texture2D(tex, clipSpace);
            return sample;
        }

        void main() {
            if(u_color_texture_flag == 0){
                gl_FragColor = useColor();
            }
            else{
                gl_FragColor = useTexture();
            }
        }
    `;

    // Texure Unit
    
    this.activeTextureUnit = -1;


    this.getMaximumTextureUnits = function(){
        return this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    }


    this.setActiveTextureUnit = function(value){ // value is -1 for color and 0 until (gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1) for texture units
        if(value < 0 || value >= this.getMaximumTextureUnits())
            return false;

        let textureAddress = this.gl.TEXTURE0 + value;
        this.gl.activeTexture(textureAddress);
        return true;
    }


    this.setTexture = function(image, slut){
        this.setActiveTextureUnit(slut);
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        console.log("Texture is loaded to TEXTURE" + slut);
    }


    this.setUseTexture = function(slut){
        this.activeTexture = slut;
        this.historyManager.setTextureSlut(this.activeTexture);
        this.gl.uniform1i(this.textureLocation, slut);
        // console.log("Fragment shader texture usage setted to TEXTURE" + slut);
    }


    this.setColorEnable = function(){
        this.historyManager.setColor(this.color[0], this.color[1], this.color[2], this.color[3])
        this.gl.uniform1i(this.colorTextureFlag, 0);
        // this.gl.uniform4f(this.colorMaskLocation, 1, 1, 1, 1);
        // this.gl.uniform4f(this.textureMaskLocation, 0, 0, 0, 0);
    }


    this.setTextureEnable = function(){
        this.historyManager.setTextureSlut(this.activeTexture);
        this.gl.uniform1i(this.colorTextureFlag, 1);
        // this.gl.uniform4f(this.colorMaskLocation, 0, 0, 0, 0);
        // this.gl.uniform4f(this.textureMaskLocation, 1, 1, 1, 1);
    }


    // Program Setups

    this.createShader = function(type, source) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        var success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
    
        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    };


    this.createProgram = function(vertexShader, fragmentShader) {
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        var success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (success) {
            return program;
        }
    
        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    };

    this.setColor = function(r, g, b, a){
        this.setColorVanilla(r,g,b,a);
        this.historyManager.setColor(r,g,b,a);
    }

    this.setColorVanilla = function(r, g, b, a){
        this.color = [r,g,b,a];
        this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    }
    
    this.setPositions = function(positions){
        this.setPositionsVanilla(positions);
        this.historyManager.submitVanilla(positions);
    }

    this.setPositionsVanilla = function(positions){
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    }

    this.justDraw = function(positions){
        this.setPositions(positions);
        this.drawFromBuffer(positions.length / 2);
    }

    this.draw = function(positions, r, g, b, a){
        this.setColor(r,g,b,a);
        this.setPositions(positions);
        this.drawFromBuffer(positions.length / 2);
    };

    this.drawFromBuffer = function(count){
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        this.gl.drawArrays(primitiveType, offset, count);
    };

    this.clear = function(r,g,b,a){
        this.gl.clearColor(r,g,b,a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.historyManager.forget();
    };

    this.repeatTheHistory = function(){
        let keys = this.historyManager.getKeys();
        let memo = this.historyManager.getMemo();

        for(let i = 0;i < keys.length;i ++){
            let key = keys[i];

            if(key.charAt(0) == "#"){ // Use Texture
                let data = key.substring(1);
                data = data.split(":");

                this.setTextureEnable();
                
                for(let j = 0;j < data.length;j ++){
                    data[j] = parseInt(data[j]);
                }
                
                this.setUseTexture(data[0]);
                this.setTextureResolutionVanilla(data[1], data[2]);
                this.textureUserTranslation = [
                    data[3] * this.texScale[0], 
                    data[4] * this.texScale[1]
                ];
                this.setTextureTranslationFromValuesToShader();
            }
            else{ // Use Color
                this.setColorEnable();
                let c = key.split(" ");
                this.setColor(c[0], c[1], c[2], c[3]);
            }

            let keyMemo = memo[key];
            this.setPositionsVanilla(keyMemo);
            this.drawFromBuffer(keyMemo.length / 2);
        }
    };

    this.setScale = function(scale){
        this.scale = [scale, scale];
        this.gl.uniform2fv(this.scaleLocation, this.scale);
    };

    this.updateScale = function(scale){
        this.setScale(scale);
        this.redraw();
    };

    this.setTranslation = function(tx, ty){
        this.translation = [tx, ty];
        this.gl.uniform2fv(this.translationLocation, this.translation);
    };

    this.updateTextureScale = function(scale){
        this.setTextureScale(scale);
        this.redraw();
    }

    this.setTextureScale = function(scale){
        this.texScale = [scale, scale];
        this.updateTextureValues();
    }

    this.setTextureResolutionVanilla = function(w, h){
        this.texResolution = [w, h];
        this.updateTextureValues();
    }

    this.setTextureResolution = function(w, h){
        this.setTextureResolutionVanilla(w, h);
        this.historyManager.setTextureResolution(w, h);
    }

    this.updateTextureValues = function(){
        this.setBaseTextureTranslation(0, - (this.gl.canvas.height % (this.texResolution[1] * this.texScale[1])));
        this.setShaderTextureResolution(this.texScale[0] * this.texResolution[0], this.texScale[1] * this.texResolution[1]);
    }

    this.setShaderTextureResolution = function(w, h){
        this.gl.uniform2f(this.textureResolutionUniformLocation, w, h);
    }

    this.setBaseTextureTranslation = function(x, y){
        this.baseTextureTranslation = [x, y];
        this.setTextureTranslation(this.texTranslation[0], this.texTranslation[1]);
    }

    this.setTextureTranslationVanilla = function(tx, ty){
        this.texTranslation = [tx, ty];
        this.setTextureTranslationFromValuesToShader();
    }

    this.setTextureTranslationFromValuesToShader = function(){
        this.gl.uniform2fv(
            this.textureTranslationLocation, 
            [
                this.texTranslation[0] + this.baseTextureTranslation[0] + this.textureUserTranslation[0],
                this.texTranslation[1] + this.baseTextureTranslation[1] + this.textureUserTranslation[1]
            ]
        );
    }

    this.setTextureUserTranslation = function(tx, ty){
        this.historyManager.setTextureTranslation(tx, ty);
        this.textureUserTranslation = [tx, ty];
    };

    this.setTextureTranslation = function(tx, ty){
        this.setTextureTranslationVanilla(tx, ty);
    };

    this.updateTranslation = function(tx, ty){
        this.setTranslation(tx, ty);
        this.redraw();
    };

    this.redraw = function(){
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);

        // Draw the geometry.
        this.repeatTheHistory();
    }

    this.updateScaleIntoPoint = function(newScale, x, y){
        let scaleRatio = newScale / this.scale[0];
        this.setScale(newScale);
        this.setTextureScale(newScale);
        this.setTextureTranslation(
            scaleRatio * this.texTranslation[0] + x - scaleRatio * x,
            scaleRatio * this.texTranslation[1] + y - scaleRatio * y
        );
        this.setTranslation(
            scaleRatio * this.translation[0] + x - scaleRatio * x, 
            scaleRatio * this.translation[1] + y - scaleRatio * y, 
        );
        this.redraw();
    }

    this.setup = function(){
        var vertexShaderSource = this.vertexShaderSource;
        var fragmentShaderSource = this.fragmentShaderSource;
        var vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        this.program = this.createProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_resolution");
        this.colorUniformLocation = this.gl.getUniformLocation(this.program, "u_color");
        this.scaleLocation = this.gl.getUniformLocation(this.program, "u_scale");
        this.translationLocation = this.gl.getUniformLocation(this.program, "u_translation");
        this.textureLocation = this.gl.getUniformLocation(this.program, "tex");

        this.textureResolutionUniformLocation = this.gl.getUniformLocation(this.program, "u_tex_resolution");
        this.textureTranslationLocation = this.gl.getUniformLocation(this.program, "u_tex_translation");
        
        // this.colorMaskLocation = this.gl.getUniformLocation(this.program, "u_color_mask");
        // this.textureMaskLocation = this.gl.getUniformLocation(this.program, "u_texture_mask");
        this.colorTextureFlag = this.gl.getUniformLocation(this.program, "u_color_texture_flag");


        this.clear(0,0,0,0);
        this.gl.uniform2fv(this.scaleLocation, this.scale);
        this.gl.uniform2fv(this.translationLocation, this.translation);
        this.gl.uniform2fv(this.textureTranslationLocation, this.texTranslation);

        // this.gl.uniform4f(this.colorMaskLocation, 1, 1, 1, 1);
        // this.gl.uniform4f(this.textureMaskLocation, 0, 0, 0, 0);
        this.gl.uniform1i(this.colorTextureFlag, 0);

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        var size = 2;          // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset
        );

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(this.textureResolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.texResolution = [this.gl.canvas.width, this.gl.canvas.height];
        this.baseTextureTranslation = [0, - (this.gl.canvas.height % (this.texResolution[1] * this.texScale[1]))];
        
    };


    // Constructor
    this.constructor = function(id, webglErrorFunction){
        this.historyManager = new HistoryManager(
            new Historian()
        );

        this.color = [0,0,0,1];
        this.activeTexture = 0;
        this.scale = [1, 1];
        this.texScale = [1, 1];
        this.texResolution = [0, 0];
        this.baseTextureTranslation = [0, 0];
        this.textureUserTranslation = [0, 0];

        this.translation = [0, 0];
        this.texTranslation = [0, 0];

        var canvas = document.getElementById(id);
        this.gl = canvas.getContext("webgl");
        if (!this.gl) {
            webglErrorFunction();
        }
        else{
            this.setup();
        }
        // window.addEventListener("resize", function(){
        //     cd.drawer.gl.uniform2f(cd.drawer.resolutionUniformLocation, cd.drawer.gl.canvas.width, cd.drawer.gl.canvas.height);
        //     cd.drawer.redraw();
        // });
    }

    // Main
    this.constructor(id, webglErrorFunction);
}
"use strict";

function PositionMaker(){

    this.reset = function(){
        this.positions = [];
    }


    this.addPolygon = function(vertices){
        let indexes = earcut(vertices);
        for(let i = 0;i < indexes.length;i ++){
            this.positions.push(vertices[indexes[i]*2]);
            this.positions.push(vertices[indexes[i]*2 + 1]);
        }
    }


    this.addLine = function(x1,y1,x2,y2,width){
        let a = x2-x1, b = y2-y1;
        let vectorLen = Math.sqrt(a*a + b*b);
        let U = [-b/vectorLen, a/vectorLen];
        
        let A = [x1, y1];
        let B = [x2, y2];
        let tmp1 = [A[0] + U[0] * width, A[1] + U[1] * width];
        let tmp2 = [A[0] - U[0] * width, A[1] - U[1] * width];
        let tmp3 = [B[0] - U[0] * width, B[1] - U[1] * width];
        let tmp4 = [B[0] + U[0] * width, B[1] + U[1] * width];

        this.positions.push(tmp1[0],tmp1[1],tmp2[0],tmp2[1],tmp3[0],tmp3[1],tmp3[0],tmp3[1],tmp4[0],tmp4[1],tmp1[0],tmp1[1]);
    }

    this.addCircle = function(cx,cy,r,cuts=15){
        let x,y;
        let cut = (Math.PI*2)/cuts;
        let ox = cx + r * Math.cos(0);
        let oy = cy + r * Math.sin(0);

        for(let i = 0;i <= Math.PI * 2;i += cut){
            x = cx + r * Math.cos(i);
            y = cy + r * Math.sin(i);
            this.positions.push(cx,cy,ox,oy,x,y)
            ox = x;
            oy = y;
        }
    }


    this.addSequenceLine = function(positions, width){
        for(let i = 0;i < (positions.length/2) - 1;i ++){
            this.addLine(positions[2*i],positions[2*i+1], positions[2*i+2], positions[2*i+3], width);
        }
    }


    this.getPositionsList = function(){
        return this.positions;
    }


    this.reset();
}
function CanvasDrawer(info){

    this.loadDataFromInfo = function(name, defaultValue) {
        return (name in this.info) ? this.info[name] : defaultValue;
    };


    // Drawer's APIs
    this.draw = function(r, g, b, a){
        this.drawer.draw(this.positionMaker.positions, r, g, b, a);
        this.positionMaker.reset();
    }


    this.justDraw = function(){
        this.drawer.justDraw(this.positionMaker.positions);
        this.positionMaker.reset();
    }


    this.loadTexture = function(image, slut){
        this.drawer.setTexture(image, slut);
    }


    this.imagesLoadTexture = function(images, callback=()=>{}){
        var imageLoadSlut = 0;
        var imagesToTextureMap = [];
        var maximumTextureUnits = this.drawer.getMaximumTextureUnits();

        images.forEach(async (image) => {
            let slut = imageLoadSlut;
            imageLoadSlut ++;
            imagesToTextureMap[image.idName] = slut >= maximumTextureUnits ? -1 : slut;
            this.loadTexture(image, slut);
        });

        callback(imagesToTextureMap);
    }


    this.loadMultiImageToTextures = function(imagesList, callback=()=>{}){
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

            this.cartographer = new Cartographer("c", setReativeTranslation, getPinPoint, getTexturePinPoint, zoominAction, zoomoutAction);
        }

        // Set Position Maker
        this.positionMaker = new PositionMaker();
    }

    // Main
    this.constructor(info);
}