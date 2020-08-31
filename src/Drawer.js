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
     * 
     * @param {Image} image texture
     * @param {integer} unit texture unit
     * @param {GLenum} internalFormat a GLenum specifying the color components in the texture
     * @param {GLenum} format a GLenum specifying the format of the texel data
     */
    this.setTexture = function(image, unit, internalFormat=this.gl.RGBA, format=this.gl.RGBA){
        this.setActiveTextureUnit(unit);
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat, format, this.gl.UNSIGNED_BYTE, image);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        console.log("Texture is loaded to TEXTURE" + unit);
    }

    /**
     * Set fragment shader to read texture from specific texture unit.
     * 
     * @param {integer} unit texture unit
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
    this.setColor = function(r, g, b, a=1){
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
     * 
     * @param {*} positions 
     */
    this.setPositions = function(positions){
        this.setPositionsVanilla(positions);
        this.historyManager.submitVanilla(positions);
    }

    /**
     * Submit vertices to the Array Buffer
     * 
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
     * Enable blending pixels
     * @param {GLenum} sfactor a ``GLenum`` specifying a multiplier for the source blending factors
     * @param {GLenum} dfactor a ``GLenum`` specifying a multiplier for the destination blending factors
     * @param {GLenum} equationA a ``GLenum`` specifying how source and destination colors are combined
     */
    this.enableBlending = function(sfactor = this.gl.SRC_ALPHA, dfactor = this.gl.ONE_MINUS_SRC_ALPHA, equation = this.gl.FUNC_ADD){
        this.gl.enable(this.gl.BLEND);
        this.gl.blendEquation(equation);
        this.gl.blendFunc(sfactor, dfactor);
    }

    /**
     * Disable blending pixels
     */
    this.disableTextureBlending = function(){
        this.gl.disable(this.gl.BLEND);
    }

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