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