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
    }


    this.setTextureEnable = function(){
        this.historyManager.setTextureSlut(this.activeTexture);
        this.gl.uniform1i(this.colorTextureFlag, 1);
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