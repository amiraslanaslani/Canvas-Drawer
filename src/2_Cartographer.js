"use strict";

function Cartographer(id,setReativeTranslation, getPinPoint=function(){return [0,0]}, zoominCallback=function(e){}, zoomoutCallback=function(e){}){
    var selector = $('#' + id);
    var clicked = false, clickY, clickX, scrollTopTmp, scrollLeftTmp;
    selector.css('cursor', 'grab');
    var pinPoint = [0,0];

    var updateScrollPos = function(e) {
        let changeY = e.pageY - clickY;
        let changeX = e.pageX - clickX;
        setReativeTranslation(changeX, changeY, pinPoint[0], pinPoint[1]);
    }

    selector.on({
        'mousemove': function(e) {
            clicked && updateScrollPos(e);
        },
        'mousedown': function(e) {
            selector.css('cursor', 'grabbing');
            pinPoint = getPinPoint();
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
        let borderPosition = selector.position();
        if(e.originalEvent.deltaY > 0) {
            zoomoutCallback(
                e.pageX - borderPosition['left'],
                e.pageY - borderPosition['top']
            );
            return;
        } 
        if(e.originalEvent.deltaY < 0) {
            zoominCallback(
                e.pageX - borderPosition['left'],
                e.pageY - borderPosition['top']
            );
            return;
        }   
    });

}
