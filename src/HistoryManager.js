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
    this.setColor = function(r, g, b, a=1){
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