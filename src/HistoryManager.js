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