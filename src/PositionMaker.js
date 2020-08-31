"use strict";

/**
 * The part of the system that converts complex shapes to 
 * triangles that can drawn by ‍‍``Drawer``
 * 
 * @returns {Object} PositionMaker object
 */
function PositionMaker(){

    /**
     * Reset all values
     */
    this.reset = function(){
        this.positions = [];
    }

    /**
     * Get array of values and add represented polygon to ``PositionMaker.positions``.
     * 
     * @param {number[]} vertices sequence of ``X``s and ``Y``s of vertices of polygon. For example ``[0,0, 50,0, 50,50, 0,50]`` represents an square
     */
    this.addPolygon = function(vertices){
        let indexes = earcut(vertices);
        for(let i = 0;i < indexes.length;i ++){
            this.positions.push(vertices[indexes[i]*2], vertices[indexes[i]*2 + 1]);
        }
    }

    /**
     * Add a line between P<sub>1</sub> and P<sub>2</sub> to ``PositionMaker.positions``.
     * 
     * @param {number} x1 X of P<sub>1</sub>
     * @param {number} y1 Y of P<sub>1</sub>
     * @param {number} x2 X of P<sub>2</sub>
     * @param {number} y2 Y of P<sub>2</sub>
     * @param {number} width width of line
     */
    this.addLine = function(x1,y1,x2,y2,width){
        let a = x2-x1, b = y2-y1;
        let vectorLen = Math.sqrt(a*a + b*b);
        let U = [-b/vectorLen, a/vectorLen];
        
        let A = [x1, y1];
        let B = [x2, y2];
        let tmp1 = [A[0] + U[0] * width, A[1] + U[1] * width];
        let tmp2 = [A[0] - U[0] * width, A[1] - U[1] * width];
        let tmp3 = [B[0] - U[0] * width, B[1] - U[1] * width];
        let tmp4 = [B[0] + U[0] * width, B[1] + U[1] * width];

        this.positions.push(tmp1[0],tmp1[1],tmp2[0],tmp2[1],tmp3[0],tmp3[1],tmp3[0],tmp3[1],tmp4[0],tmp4[1],tmp1[0],tmp1[1]);
    }

    /**
     * Add a circle that centered on ``P`` with radius of ``R`` to ``PositionMaker.positions``.
     * 
     * @param {number} cx X of P
     * @param {number} cy Y of P
     * @param {number} r radius
     * @param {integer} cuts number of triangles to draw circle
     */
    this.addCircle = function(cx,cy,r,cuts=15){
        let x,y;
        let cut = (Math.PI*2)/cuts;
        let ox = cx + r * Math.cos(0);
        let oy = cy + r * Math.sin(0);

        for(let i = 0;i <= Math.PI * 2;i += cut){
            x = cx + r * Math.cos(i);
            y = cy + r * Math.sin(i);
            this.positions.push(cx,cy,ox,oy,x,y);
            ox = x;
            oy = y;
        }
    }

    /**
     * Add a rectangle P<sub>1</sub>P<sub>2</sub>P<sub>3</sub>P<sub>4</sub> to ``PositionMaker.positions``.
     * @param {number} x1 X of P<sub>1</sub>
     * @param {number} y1 Y of P<sub>1</sub>
     * @param {number} x2 X of P<sub>3</sub>
     * @param {number} y2 Y of P<sub>3</sub>
     */
    this.addRectangle = function(x1, y1, x2, y2){
        this.positions.push(
            x1, y1,
            x1, y2,
            x2, y1,
            x2, y1,
            x1, y2,
            x2, y2
        );
    }

    /**
     * Add multiple lines to ``PositionMaker.positions``
     * @param {number[]} positions sequence of vetices of line. For example ``[0,0, 100,0, 100,50]`` represents an L shape line
     * @param {number} width line width
     */
    this.addSequenceLine = function(positions, width){
        for(let i = 0;i < (positions.length/2) - 1;i ++){
            this.addLine(positions[2*i],positions[2*i+1], positions[2*i+2], positions[2*i+3], width);
        }
    }

    /**
     * Returns the array that contains the vertices of the triangles
     * @returns {number[]} ``PositionMaker.positions``
     */
    this.getPositionsList = function(){
        return this.positions;
    }

    /**
     * The array that contains the vertices of the triangles
     */
    this.positions = [];
}