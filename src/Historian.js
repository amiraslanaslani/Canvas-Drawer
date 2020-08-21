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