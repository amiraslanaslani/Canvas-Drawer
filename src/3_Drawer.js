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

        void main() {
            gl_FragColor = u_color;
        }
    `;

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
        this.historian.setColor(r,g,b,a);
    }

    this.setColorVanilla = function(r, g, b, a){
        this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    }
    
    this.setPositions = function(positions){
        this.setPositionsVanilla(positions);
        this.historian.submitVanilla(positions);
    }

    this.setPositionsVanilla = function(positions){
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
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
        this.historian.forget();
    };

    this.repeatTheHistory = function(){
        let keys = this.historian.getKeys();
        let memo = this.historian.getMemo();

        for(let i = 0;i < keys.length;i ++){
            let key = keys[i];
            let c = key.split(" ");
            this.setColor(c[0], c[1], c[2], c[3]);
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

    this.updateTranslation = function(tx, ty){
        this.setTranslation(tx, ty);
        this.redraw();
    };

    this.updateRelativeTranslaton = function(rx, ry){
        this.updateTranslation(
            this.translation[0] + rx, 
            this.translation[1] + ry
        );
    }

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
        this.setTranslation(
            scaleRatio * this.translation[0] + x - scaleRatio * x, 
            scaleRatio * this.translation[1] + y - scaleRatio * y
        );
        this.redraw();
    }

    // this.addTexture = function(name, url){
    //     var tex = this.gl.createTexture();
    //     this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    //     // Fill the texture with a 1x1 blue pixel.
    //     this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
    //                     new Uint8Array([0, 0, 255, 255]));
    
    //     // let's assume all images are not a power of 2
    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    //     this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    
    //     var textureInfo = {
    //         width: 1,   // we don't know the size until it loads
    //         height: 1,
    //         texture: tex,
    //     };
    //     var img = new Image();
    //     img.addEventListener('load', function() {
    //         textureInfo.width = img.width;
    //         textureInfo.height = img.height;
    
    //         drawer.gl.bindTexture(drawer.gl.TEXTURE_2D, textureInfo.texture);
    //         drawer.gl.texImage2D(drawer.gl.TEXTURE_2D, 0, drawer.gl.RGBA, drawer.gl.RGBA, drawer.gl.UNSIGNED_BYTE, img);
    //     });
    //     img.src = url;
        
    //     if(!(name in this.textures)){
    //         this.texturesList.push(name);
    //     }
    //     this.textures[name] = textureInfo;
        
    //     return textureInfo;
    // }

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

        this.clear(0,0,0,0);
        this.gl.uniform2fv(this.scaleLocation, this.scale);
        this.gl.uniform2fv(this.translationLocation, this.translation);

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
    };


    this.historian = new Historian();
    this.scale = [1, 1];

    this.textures = {};
    this.texturesList = [];

    this.translation = [0, 0];
    var canvas = document.getElementById(id);
    this.gl = canvas.getContext("webgl");
    if (!this.gl) {
        webglErrorFunction();
    }
    else{
        this.setup();
    }
    window.addEventListener("resize", function(){
        drawer.gl.uniform2f(drawer.resolutionUniformLocation, drawer.gl.canvas.width, drawer.gl.canvas.height);
        drawer.redraw();
    });
}