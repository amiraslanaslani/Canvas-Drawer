"use strict";

/**
 * The section of program that provide user intractions with an element.
 * Canvas Drawer uses this to provide zoom in/out and mouse drag option.
 * 
 * @param {string} id ID of element in html
 * @param {function} setReativeTranslation function that set relative translation
 * @param {function} getPinPoint function that returns mouse pin point
 * @param {function} getTexturePinPoint function that returns texture pin point
 * @param {function} zoominCallback function that calls when wants to zoom in to (x, y)
 * @param {function} zoomoutCallback function that calls when wants to zoom out to (x, y)
 * @returns {Object} Cartographer object
 * @example
 *  var cartographer = new Cartographer(
 *      id, 
 *      setReativeTranslation, 
 *      getPinPoint, 
 *      getTexturePinPoint, 
 *      zoominAction, 
 *      zoomoutAction
 *  );
 */
function Cartographer(id,setRelativeTranslation, getPinPoint=function(){return [0,0]}, getTexturePinPoint=function(){return [0,0]}, zoominCallback=function(x, y){}, zoomoutCallback=function(x, y){}){
    var selector = $('#' + id);
    var clicked = false, clickY, clickX, scrollTopTmp, scrollLeftTmp;
    selector.css('cursor', 'grab');
    var pinPoint = [0,0];
    var texPinPoint = [0,0];

    var updateScrollPos = function(e) {
        let changeY = e.pageY - clickY;
        let changeX = e.pageX - clickX;
        setRelativeTranslation(changeX, changeY, pinPoint[0], pinPoint[1], texPinPoint[0], texPinPoint[1]);
    }

    selector.on({
        'mousemove': function(e) {
            clicked && updateScrollPos(e);
        },
        'mousedown': function(e) {
            selector.css('cursor', 'grabbing');
            pinPoint = getPinPoint();
            texPinPoint = getTexturePinPoint();
            clicked = true;
            clickY = e.pageY;
            clickX = e.pageX;
            scrollTopTmp = selector.scrollTop();
            scrollLeftTmp = selector.scrollLeft();
        },
        'mouseleave': function() {
            clicked = false;
            selector.css('cursor', 'grab');
        },
        'mouseup': function() {
            clicked = false;
            selector.css('cursor', 'grab');
        }
    });

    selector.on("wheel mousewheel", function(e){
        e.preventDefault();
        let borderPosition = selector.offset();

        let pos = [
            e.pageX - borderPosition['left'],
            e.pageY - borderPosition['top']
        ];

        if(e.originalEvent.deltaY > 0) {
            zoomoutCallback(
                pos[0],
                pos[1]
            );
            return;
        } 
        if(e.originalEvent.deltaY < 0) {
            zoominCallback(
                pos[0],
                pos[1]
            );
            return;
        }   
    });

}
