function CanvasDrawer(info){

    this.loadDataFromInfo = function(name, defaultValue) {
        return (name in this.info) ? this.info[name] : defaultValue;
    };

    this.info = info;

    var id = this.loadDataFromInfo('id', false);
    var errorFunction = this.loadDataFromInfo('error', function(){});
    var isCartographerEnable = this.loadDataFromInfo('cartographer', false);
    var zoomInRate = this.loadDataFromInfo('zoominrate', 1.1);
    var zoomOutRate = this.loadDataFromInfo('zoomoutrate', 0.9);

    if(id === false){
        console.log("CanvasDrawer can not found element with id that you pass or maybe you don't pass any id!");
        return;
    }

    // Set Drawer
    this.drawer = new Drawer(id, errorFunction);

    // Set Cartographer
    if(isCartographerEnable){
        let drawer = this.drawer;

        var setReativeTranslation = function(rx, ry, px, py){
            drawer.updateTranslation(px + rx, py + ry);
        }

        var getPinPoint = function(){
            return drawer.translation;
        }

        var zoominAction = function (x,y) {
            let scale = drawer.scale[0];
            drawer.updateScaleIntoPoint(scale * zoomInRate,x,y);
        }

        var zoomoutAction = function (x,y) {
            let scale = drawer.scale[0];
            drawer.updateScaleIntoPoint(scale * zoomOutRate,x,y);
        }

        this.cartographer = new Cartographer("c", setReativeTranslation, getPinPoint, zoominAction, zoomoutAction);
    }

    // Set Position Maker
    this.positionMaker = new PositionMaker();

    this.draw = function(r, g, b, a){
        drawer.draw(this.positionMaker.positions, r, g, b, a);
        this.positionMaker.reset();
    }

}