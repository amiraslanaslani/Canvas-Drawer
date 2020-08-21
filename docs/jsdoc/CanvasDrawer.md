## Functions

<dl>
<dt><a href="#loadDataFromInfo">loadDataFromInfo(name, defaultValue)</a> ⇒ <code>*</code></dt>
<dd><p>Get value of specific key. If key not found in <code>this.info</code> object
then returns defaultValue.</p>
</dd>
<dt><a href="#draw">draw(r, g, b, a)</a></dt>
<dd><p>Draw shapes that are added to the Position Maker with specific 
color and reset the Position Maker.</p>
</dd>
<dt><a href="#justDraw">justDraw()</a></dt>
<dd><p>Draw shapes that are added to the Position Maker and reset that.</p>
</dd>
<dt><a href="#loadTexture">loadTexture(image, slut)</a></dt>
<dd><p>Call Drawer.setTexture(image, slut)</p>
</dd>
<dt><a href="#imagesLoadTexture">imagesLoadTexture(images, callback)</a></dt>
<dd><p>Get an array of loaded Image objects and load them to texture
units. When done calls the callback function with an associative
array that maps image.idName to texture unit.</p>
</dd>
<dt><a href="#loadMultiImageToTextures">loadMultiImageToTextures(imagesList, callback)</a></dt>
<dd><p>This function will accept an array of some images path and load 
them to texture units. When all images are loaded to texture units 
then calls the callback function.</p>
</dd>
<dt><a href="#constructor">constructor(info)</a></dt>
<dd><p>Constructor function. Get info object and set values.</p>
</dd>
</dl>

<a name="loadDataFromInfo"></a>

## loadDataFromInfo(name, defaultValue) ⇒ <code>\*</code>
Get value of specific key. If key not found in ``this.info`` objectthen returns defaultValue.

**Kind**: global function  
**Returns**: <code>\*</code> - value of key  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | key name |
| defaultValue | <code>\*</code> | value |

<a name="draw"></a>

## draw(r, g, b, a)
Draw shapes that are added to the Position Maker with specific color and reset the Position Maker.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="justDraw"></a>

## justDraw()
Draw shapes that are added to the Position Maker and reset that.

**Kind**: global function  
<a name="loadTexture"></a>

## loadTexture(image, slut)
Call Drawer.setTexture(image, slut)

**Kind**: global function  

| Param | Type |
| --- | --- |
| image | <code>Image</code> | 
| slut | <code>\*</code> | 

<a name="imagesLoadTexture"></a>

## imagesLoadTexture(images, callback)
Get an array of loaded Image objects and load them to textureunits. When done calls the callback function with an associativearray that maps image.idName to texture unit.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| images | <code>Array.&lt;Image&gt;</code> | array of loaded Image objects with idName attr. |
| callback | <code>function</code> | callback function |

<a name="loadMultiImageToTextures"></a>

## loadMultiImageToTextures(imagesList, callback)
This function will accept an array of some images path and load them to texture units. When all images are loaded to texture units then calls the callback function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| imagesList | <code>Array.&lt;string&gt;</code> | array of images path |
| callback | <code>function</code> | callback function |

<a name="constructor"></a>

## constructor(info)
Constructor function. Get info object and set values.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| info | <code>Object</code> |  |
| info.id | <code>string</code> | id of canvas element |
| info.errorFunction | <code>function</code> | callback function for when user cannot use webgl |
| info.isCartographerEnable | <code>boolean</code> | value is True when you want zoomin/out and translation with mouse |
| info.zoomInRate | <code>float</code> | zoomin rate default:1.1 (just if isCartographerEnable enabled) |
| info.zoomOutRate | <code>float</code> | zoomout rate default:0.9 (just if isCartographerEnable enabled) |

