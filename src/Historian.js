"use strict";

function Historian(){
    this.memo = {};
    this.keys = [];
    this.r = this.g = this.b = this.a = 0;

    this.submit = function(positions, r, g, b, a){
        let key = "" + r + " " + g + " " + b + " " + a;
        if(! (key in this.memo)){
            this.keys.push(key);
            this.memo[key] = [];
        }
        
        this.memo[key] = this.memo[key].concat(positions);
    }

    this.submitVanilla = function(positions){
        this.submit(positions, this.r, this.g, this.b, this.a);
    }

    this.setColor = function(r,g,b,a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
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