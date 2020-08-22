/*!
 * Canvas Drawer v0.1.0
 * Minimal WebGL-based 2D visualization library
 * https://github.com/amiraslanaslani/Canvas-Drawer
 * 
 * Released under the Apache license 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Date: 2020-08-22T08:44:59.952Z (Sat, 22 Aug 2020 08:44:59 GMT)
 */

"use strict";

/**
 * The part of the system that connects ``Drawer`` to ``Historian``.
 * 
 * @param {Object} historian Historian object
 * @returns {Object} HistoryManager object
 * @example
 * var hm = new HistoryManager(
 *      new Historian();
 * );
 */
function HistoryManager(historian){
    /**
     * Historian object
     */
    this.historian = historian;

    // Color Attr.
    this.r = this.g = this.b = this.a = 1;
    
    //Texture Attr.
    this.t_slut = 0;
    this.t_resolution = [1, 1];
    this.t_translation = [0, 0];

    /**
     * Set current color to historian
     * 
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.setColor = function(r, g, b, a){
        let key = "" + r + " " + g + " " + b + " " + a;
        this.historian.setKey(key);
    }

    /**
     * Update the historian's key with current texture values
     */
    this.updateTextureKey = function(){
        let key =   "#" + this.t_slut + 
                    ":" + this.t_resolution[0] + // Resolution W
                    ":" + this.t_resolution[1] + // Resolution H
                    ":" + this.t_translation[0] + // Translation X
                    ":" + this.t_translation[1]; // Translation Y

        this.historian.setKey(key);
    }

    /**
     * Announced current texture's unit number to historian
     * 
     * @param {integer} unit texture unit
     */
    this.setTextureSlut = function(unit){
        this.t_slut = unit;
        this.updateTextureKey();
    }

    /**
     * Announced current texture's resolution to historian
     * @param {number} w 
     * @param {number} h 
     */
    this.setTextureResolution = function(w, h){
        this.t_resolution = [w, h];
        this.updateTextureKey();
    }

    /**
     * Announced current texture's translation to historian
     * @param {number} x
     * @param {number} y 
     */
    this.setTextureTranslation = function(x, y){
        this.t_translation = [x, y];
        this.updateTextureKey();
    }

    /**
     * Submit passed vertices for current key ( ``HistoryManager.historian.key`` )
     * @param {number[]} positions 
     */
    this.submitVanilla = function(positions){
        this.historian.submitVanilla(positions);
    }

    /**
     * Clear the history
     * Calls ``HistoryManager.historian.forget()``
     */
    this.forget = function(){
        this.historian.forget();
    }

    /**
     * returns keys set of historian
     * @returns {string[]} keys
     */
    this.getKeys = function(){
        return this.historian.getKeys();
    }


    /**
     * returns memory of historian
     * @returns {Object} memory
     */
    this.getMemo = function(){
        return this.historian.getMemo();
    }

    // Constructor
    this.historian = historian;
}
"use strict";

/**
 * The part of the system that holds history
 * @returns {Object} Historian object
 */
function Historian(){
    /**
     * Memory object that maps keys to memories.
     */
    this.memo = {};

    /**
     * Array of submited Keys.
     */
    this.keys = [];

    /**
     * Value of current key.
     */
    this.key = "-1";

    /**
     * Submit passed vertices for passed key
     * 
     * @param {number[]} positions array of vertices
     * @param {string} key key
     */
    this.submit = function(positions, key){
        if(! (key in this.memo)){
            this.keys.push(key);
            this.memo[key] = [];
        }
        
        this.memo[key] = this.memo[key].concat(positions);
    }

    /**
     * Submit passed vertices for current key ( ``Historian.key`` )
     * @param {number[]} positions array of vertices
     */
    this.submitVanilla = function(positions){
        this.submit(positions, this.key);
    }

    /**
     * Set key to current key ( ``Historian.key`` )
     * @param {string} key 
     */
    this.setKey = function(key){
        this.key = key;
    }

    /**
     * Clear the history
     */
    this.forget = function(){
        this.memo = {};
        this.key = [];
    }

    /**
     * returns ``Historian.memo``
     * @returns {Object} memory
     */
    this.getMemo = function(){
        return this.memo;
    }

    /**
     * returns ``Historian.keys``
     * @returns {string[]} keys
     */
    this.getKeys = function(){
        return this.keys;
    }
}
"use strict";

/**
 * The section of program that provide user intractions with an element.
 * Canvas Drawer uses this to provide zoom in/out and mouse drag option.
 * 
 * @param {string} id ID of element in html
 * @param {function} setReativeTranslation function that set relative translation
 * @param {function} getPinPoint function that returns mouse pin point
 * @param {function} getTexturePinPoint function that returns texture pin point
 * @param {function} zoominCallback function that calls when wants to zoom in to (x, y)
 * @param {function} zoomoutCallback function that calls when wants to zoom out to (x, y)
 * @returns {Object} Cartographer object
 * @example
 *  var cartographer = new Cartographer(
 *      id, 
 *      setReativeTranslation, 
 *      getPinPoint, 
 *      getTexturePinPoint, 
 *      zoominAction, 
 *      zoomoutAction
 *  );
 */
function Cartographer(id,setRelativeTranslation, getPinPoint=function(){return [0,0]}, getTexturePinPoint=function(){return [0,0]}, zoominCallback=function(x, y){}, zoomoutCallback=function(x, y){}){
    var selector = $('#' + id);
    var clicked = false, clickY, clickX, scrollTopTmp, scrollLeftTmp;
    selector.css('cursor', 'grab');
    var pinPoint = [0,0];
    var texPinPoint = [0,0];

    var updateScrollPos = function(e) {
        let changeY = e.pageY - clickY;
        let changeX = e.pageX - clickX;
        setRelativeTranslation(changeX, changeY, pinPoint[0], pinPoint[1], texPinPoint[0], texPinPoint[1]);
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

/**
 * Manages the drawing procedure
 * 
 * @param {string} id id of canvas element
 * @param {function} webglErrorFunction callback function for when user cannot use webgl
 * @returns {Object} Drawer object
 */
function Drawer(id, webglErrorFunction){

    /**
     * Vertex Shader
     */
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

    /**
     * Fragment Shader
     */
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

    /**
     * @returns {integer} Maximum Texture Units Number
     */
    this.getMaximumTextureUnits = function(){
        return this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    }

    /**
     * Get a texture unit and activate it
     * @param {integer} value texture unit
     * @returns {boolean} if texture unit number is not in valid range return true otherwise return false
     */
    this.setActiveTextureUnit = function(value){ // value is -1 for color and 0 until (gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1) for texture units
        if(value < 0 || value >= this.getMaximumTextureUnits())
            return false;

        let textureAddress = this.gl.TEXTURE0 + value;
        this.gl.activeTexture(textureAddress);
        return true;
    }

    /**
     * Set image to specific texture unit
     * @param {Image} image 
     * @param {integer} unit 
     */
    this.setTexture = function(image, unit){
        this.setActiveTextureUnit(unit);
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        console.log("Texture is loaded to TEXTURE" + unit);
    }

    /**
     * Set fragment shader to read texture from specific texture unit.
     * @param {integer} unit 
     */
    this.setUseTexture = function(unit){
        this.activeTexture = unit;
        this.historyManager.setTextureSlut(this.activeTexture);
        this.gl.uniform1i(this.textureLocation, unit);
        // console.log("Fragment shader texture usage setted to TEXTURE" + unit);
    }

    /**
     * Set fragment shader to read from active texture unit
     */
    this.setColorEnable = function(){
        this.historyManager.setColor(this.color[0], this.color[1], this.color[2], this.color[3])
        this.gl.uniform1i(this.colorTextureFlag, 0);
    }

    /**
     * Set fragment shader to read from color uniform
     */
    this.setTextureEnable = function(){
        this.historyManager.setTextureSlut(this.activeTexture);
        this.gl.uniform1i(this.colorTextureFlag, 1);
    }

    /**
     * Set color to fragment shader and submit in the history
     * 
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.setColor = function(r, g, b, a){
        this.setColorVanilla(r,g,b,a);
        this.historyManager.setColor(r,g,b,a);
    }

    /**
     * Set color to fragment shader but don't submit in the history
     * 
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.setColorVanilla = function(r, g, b, a){
        this.color = [r,g,b,a];
        this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    }
    
    /**
     * Submit vertices to the Array Buffer and submited in the history 
     * @param {*} positions 
     */
    this.setPositions = function(positions){
        this.setPositionsVanilla(positions);
        this.historyManager.submitVanilla(positions);
    }

    /**
     * Submit vertices to the Array Buffer
     * @param {number[]} positions array of vertices ``[x1, y1, x2, y2, ...]``
     */
    this.setPositionsVanilla = function(positions){
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    }

    /**
     * Draw triangles that are passed.
     * 
     * @param {number[]} positions array of vertices ``[x1, y1, x2, y2, ...]``
     */
    this.justDraw = function(positions){
        this.setPositions(positions);
        this.drawFromBuffer(positions.length / 2);
    }

    /**
     * Draw triangles are passed with a specific color.
     * 
     * @param {*} positions array of vertices ``[x1, y1, x2, y2, ...]``
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.draw = function(positions, r, g, b, a){
        this.setColor(r,g,b,a);
        this.setPositions(positions);
        this.drawFromBuffer(positions.length / 2);
    };

    /**
     * Draw triangles in the Array Buffer
     * 
     * @param {integer} count number of vertices
     */
    this.drawFromBuffer = function(count){
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        this.gl.drawArrays(primitiveType, offset, count);
    };

    /**
     * Clear screen with passed color and reset the history.
     * 
     * @param {integer} r red color in range 0-1
     * @param {integer} g green color in range 0-1
     * @param {integer} b blue color in range 0-1
     * @param {integer} a alpha color in range 0-1
     */
    this.clear = function(r,g,b,a){
        this.gl.clearColor(r,g,b,a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.historyManager.forget();
    };

    /**
     * Change scale value.
     * 
     * @param {number} scale new scale
     */
    this.setScale = function(scale){
        this.scale = [scale, scale];
        this.gl.uniform2fv(this.scaleLocation, this.scale);
    };

    /**
     * Change scale value and redraw every shape
     * 
     * @param {number} scale new scale
     */
    this.updateScale = function(scale){
        this.setScale(scale);
        this.redraw();
    };

    /**
     * Change translation value.
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.setTranslation = function(tx, ty){
        this.translation = [tx, ty];
        this.gl.uniform2fv(this.translationLocation, this.translation);
    };

    /**
     * Update texture scale value and redraw every shape.
     * 
     * @param {number} scale new scale value
     */
    this.updateTextureScale = function(scale){
        this.setTextureScale(scale);
        this.redraw();
    }

    /**
     * Update texture scale value and calculate required settings.
     * 
     * @param {number} scale new scale value
     */
    this.setTextureScale = function(scale){
        this.texScale = [scale, scale];
        this.updateTextureValues();
    }

    /**
     * Reset some values calculated for texture by program. For 
     * example reset Base Translation of texture.
     */
    this.updateTextureValues = function(){
        this.setBaseTextureTranslation(0, - (this.gl.canvas.height % (this.texResolution[1] * this.texScale[1])));
        this.setShaderTextureResolution(this.texScale[0] * this.texResolution[0], this.texScale[1] * this.texResolution[1]);
    }

    /**
     * Updates shader uniform that keeps textures resolution and
     * submit that in history.
     * 
     * @param {number} w width of texture
     * @param {number} h heigt of texture
     */
    this.setTextureResolution = function(w, h){
        this.setTextureResolutionVanilla(w, h);
        this.historyManager.setTextureResolution(w, h);
    }

    /**
     * Updates shader uniform that keeps textures resolution and
     * doesn't submit that in history.
     * 
     * @param {number} w width of texture
     * @param {number} h heigt of texture
     */
    this.setTextureResolutionVanilla = function(w, h){
        this.texResolution = [w, h];
        this.updateTextureValues();
    }

    /**
     * Updates shader uniform that keeps textures resolution.
     * 
     * @param {number} w width of texture
     * @param {number} h heigt of texture
     */
    this.setShaderTextureResolution = function(w, h){
        this.gl.uniform2f(this.textureResolutionUniformLocation, w, h);
    }

    /**
     * Set texture translation value from local variables to shader's uniform
     */
    this.setTextureTranslationFromValuesToShader = function(){
        this.gl.uniform2fv(
            this.textureTranslationLocation, 
            [
                this.texTranslation[0] + this.baseTextureTranslation[0] + this.textureUserTranslation[0],
                this.texTranslation[1] + this.baseTextureTranslation[1] + this.textureUserTranslation[1]
            ]
        );
    }

    /**
     * Change texture's base translation and set it's value to shader's uniform.
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.setBaseTextureTranslation = function(tx, ty){
        this.baseTextureTranslation = [tx, ty];
        this.setTextureTranslation(this.texTranslation[0], this.texTranslation[1]);
    }

    /**
     * Set user-defined translation
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.setTextureUserTranslation = function(tx, ty){
        this.historyManager.setTextureTranslation(tx, ty);
        this.textureUserTranslation = [tx, ty];
    };

    /**
     * Change texture translation and set it's value to shader's uniform.
     * Calls ``Drawer.setTextureTranslationVanilla(tx, ty)``
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.setTextureTranslation = function(tx, ty){
        this.setTextureTranslationVanilla(tx, ty);
    };

    /**
     * Change texture translation and set it's value to shader's uniform.
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.setTextureTranslationVanilla = function(tx, ty){
        this.texTranslation = [tx, ty];
        this.setTextureTranslationFromValuesToShader();
    }

    /**
     * Update vertex translation value and redraw every shape.
     * 
     * @param {number} tx X value of translation
     * @param {number} ty Y value of translation
     */
    this.updateTranslation = function(tx, ty){
        this.setTranslation(tx, ty);
        this.redraw();
    };
    
    /**
     * Redraw any shape in history.
     */
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

    /**
     * Redraw any shape in history. (Call ``Drawer.repeatTheHistory()`` )
     */
    this.redraw = function(){
        // Draw the geometry.
        this.repeatTheHistory();
    }

    /**
     * Change scale centered on point P
     * @param {number} newScale 
     * @param {number} x x value of P
     * @param {number} y y value of P
     */
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
    
    /**
     * Create WebGL shader object from given data.
     * 
     * @param {number} type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
     * @param {string} source GLSL source code of shader
     * @returns {WebGLShader} webgl shader object
     */
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

    /**
     * Create WebGL program object from given data.
     * 
     * @param {WebGLShader} vertexShader vertex shader
     * @param {WebGLShader} fragmentShader fragment shader
     * @returns {WebGLProgram} webgl program object
     */
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

    /**
     * Initialize variables and uniforms
     */
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
        
        this.colorTextureFlag = this.gl.getUniformLocation(this.program, "u_color_texture_flag");

        this.clear(0,0,0,0);
        this.gl.uniform2fv(this.scaleLocation, this.scale);
        this.gl.uniform2fv(this.translationLocation, this.translation);
        this.gl.uniform2fv(this.textureTranslationLocation, this.texTranslation);

        this.gl.uniform1i(this.colorTextureFlag, 0);

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        var size = 2;               // 2 components per iteration
        var type = this.gl.FLOAT;   // the data is 32bit floats
        var normalize = false;      // don't normalize the data
        var stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;             // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            this.positionAttributeLocation, size, type, normalize, stride, offset
        );

        this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(this.textureResolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        this.texResolution = [this.gl.canvas.width, this.gl.canvas.height];
        this.baseTextureTranslation = [0, - (this.gl.canvas.height % (this.texResolution[1] * this.texScale[1]))];
    };


    /**
     * Construction Function
     * 
     * @param {string} id id of canvas element
     * @param {function} webglErrorFunction callback function for when user cannot use webgl
     */
    this.constructor = function(id, webglErrorFunction){
        this.historyManager = new HistoryManager(
            new Historian()
        );

        this.activeTextureUnit = -1;
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
    }

    // Main
    this.constructor(id, webglErrorFunction);
}
"use strict";

/**
 * The part of the system that converts complex shapes to 
 * triangles that can drawn by ‍‍``Drawer``
 * 
 * @returns {Object} PositionMaker object
 */
function PositionMaker(){

    /**
     * Reset all values
     */
    this.reset = function(){
        this.positions = [];
    }

    /**
     * Get array of values and add represented polygon to ``PositionMaker.positions``.
     * 
     * @param {number[]} vertices sequence of ``X``s and ``Y``s of vertices of polygon. For example ``[0,0, 50,0, 50,50, 0,50]`` represents an square
     */
    this.addPolygon = function(vertices){
        let indexes = earcut(vertices);
        for(let i = 0;i < indexes.length;i ++){
            this.positions.push(vertices[indexes[i]*2]);
            this.positions.push(vertices[indexes[i]*2 + 1]);
        }
    }

    /**
     * Add a line between ``P1`` and ``P2`` to ``PositionMaker.positions``.
     * 
     * @param {number} x1 X of P1
     * @param {number} y1 Y of P1
     * @param {number} x2 X of P2
     * @param {number} y2 Y of P2
     * @param {number} width width of line
     */
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

    /**
     * Add a circle that centered on ``P`` with radius of ``R`` to ``PositionMaker.positions``.
     * @param {number} cx X of P
     * @param {number} cy Y of P
     * @param {number} r radius
     * @param {integer} cuts number of triangles to draw circle
     */
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

    /**
     * Add multiple lines to ``PositionMaker.positions``
     * @param {number[]} positions sequence of vetices of line. For example ``[0,0, 100,0, 100,50]`` represents an L shape line
     * @param {number} width line width
     */
    this.addSequenceLine = function(positions, width){
        for(let i = 0;i < (positions.length/2) - 1;i ++){
            this.addLine(positions[2*i],positions[2*i+1], positions[2*i+2], positions[2*i+3], width);
        }
    }

    /**
     * Returns the array that contains the vertices of the triangles
     * @returns {number[]} ``PositionMaker.positions``
     */
    this.getPositionsList = function(){
        return this.positions;
    }

    /**
     * The array that contains the vertices of the triangles
     */
    this.positions = [];
}
"use strict";

/**
 * Get info object and set values.
 * 
 * @param {Object} info 
 * @param {string} info.id id of canvas element
 * @param {function} info.errorFunction callback function for when user cannot use webgl
 * @param {boolean} info.isCartographerEnable value is True when you want zoomin/out and translation with mouse
 * @param {float} info.zoomInRate zoomin rate default:1.1 (just if isCartographerEnable enabled)
 * @param {float} info.zoomOutRate zoomout rate default:0.9 (just if isCartographerEnable enabled)
 * @returns {Object} CanvasDrawer object
 * @example
 * var cd = new CanvasDrawer({
 *    'id': 'myCanvas',
 *    'errorFunction': ()=>alert("You can't load WebGL right now"),
 *    'cartographer': true
 * });
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
     * Calls ``Drawer.setTexture(image, unit)``
     * 
     * @param {Image} image 
     * @param {number} unit 
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
     * Add a circle that centered on ``P`` with radius of ``R``.
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