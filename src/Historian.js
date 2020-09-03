"use strict";

/**
 * The part of the system that holds history
 * @returns {Object} Historian object
 */
function Historian(){

    /**
     * Get clone of this Historian object
     * @returns {Object} cloned historian object
     */
    this.clone = function(){
        let newOne = new Historian();
        newOne.keys = JSON.parse(JSON.stringify(this.keys));
        newOne.memo = JSON.parse(JSON.stringify(this.memo));
        return newOne;
    }

    /**
     * Get clone of all data saved in this historian
     * @returns {Object} clone of all data saved in this historian
     */
    this.getDataCopy = function(){
        let newOne = {};
        newOne.keys = JSON.parse(JSON.stringify(this.keys));
        newOne.memo = JSON.parse(JSON.stringify(this.memo));
        return newOne;
    }

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
     * Add empty key.
     * 
     * @param {string} key key
     */
    this.addKey = function(key){
        if(! (key in this.memo)){
            this.keys.push(key);
            this.memo[key] = [];
        }
    }

    /**
     * Submit passed vertices for passed key
     * 
     * @param {number[]} positions array of vertices
     * @param {string} key key
     */
    this.submit = function(positions, key){
        this.addKey(key);
        
        for (const position of positions) {
            this.memo[key].push(position);
        }
        // Array.prototype.push.apply(this.memo[key], positions);
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