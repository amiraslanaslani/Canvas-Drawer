"use strict";

function HistoryManager(historian){

    this.historian = historian;

    this.setColor = function(r, g, b, a){
        let key = "" + r + " " + g + " " + b + " " + a;
        this.historian.setKey(key);
    }

    this.setTexture = function(){
        // TODO
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