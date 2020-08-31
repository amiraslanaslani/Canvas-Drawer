# Drawer

## Members

<dl>
<dt><a href="#vertexShaderSource">vertexShaderSource</a></dt>
<dd><p>Vertex Shader</p>
</dd>
<dt><a href="#fragmentShaderSource">fragmentShaderSource</a></dt>
<dd><p>Fragment Shader</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#Drawer">Drawer(id, webglErrorFunction)</a> ⇒ <code>Object</code></dt>
<dd><p>Manages the drawing procedure</p>
</dd>
<dt><a href="#getMaximumTextureUnits">getMaximumTextureUnits()</a> ⇒ <code>integer</code></dt>
<dd></dd>
<dt><a href="#setActiveTextureUnit">setActiveTextureUnit(value)</a> ⇒ <code>boolean</code></dt>
<dd><p>Get a texture unit and activate it</p>
</dd>
<dt><a href="#setTexture">setTexture(image, unit, internalFormat, format)</a></dt>
<dd><p>Set image to specific texture unit</p>
</dd>
<dt><a href="#setUseTexture">setUseTexture(unit)</a></dt>
<dd><p>Set fragment shader to read texture from specific texture unit.</p>
</dd>
<dt><a href="#setColorEnable">setColorEnable()</a></dt>
<dd><p>Set fragment shader to read from active texture unit</p>
</dd>
<dt><a href="#setTextureEnable">setTextureEnable()</a></dt>
<dd><p>Set fragment shader to read from color uniform</p>
</dd>
<dt><a href="#setColor">setColor(r, g, b, a)</a></dt>
<dd><p>Set color to fragment shader and submit in the history</p>
</dd>
<dt><a href="#setColorVanilla">setColorVanilla(r, g, b, a)</a></dt>
<dd><p>Set color to fragment shader but don&#39;t submit in the history</p>
</dd>
<dt><a href="#setPositions">setPositions(positions)</a></dt>
<dd><p>Submit vertices to the Array Buffer and submited in the history</p>
</dd>
<dt><a href="#setPositionsVanilla">setPositionsVanilla(positions)</a></dt>
<dd><p>Submit vertices to the Array Buffer</p>
</dd>
<dt><a href="#justDraw">justDraw(positions)</a></dt>
<dd><p>Draw triangles that are passed.</p>
</dd>
<dt><a href="#draw">draw(positions, r, g, b, a)</a></dt>
<dd><p>Draw triangles are passed with a specific color.</p>
</dd>
<dt><a href="#drawFromBuffer">drawFromBuffer(count)</a></dt>
<dd><p>Draw triangles in the Array Buffer</p>
</dd>
<dt><a href="#clear">clear(r, g, b, a)</a></dt>
<dd><p>Clear screen with passed color and reset the history.</p>
</dd>
<dt><a href="#setScale">setScale(scale)</a></dt>
<dd><p>Change scale value.</p>
</dd>
<dt><a href="#updateScale">updateScale(scale)</a></dt>
<dd><p>Change scale value and redraw every shape</p>
</dd>
<dt><a href="#setTranslation">setTranslation(tx, ty)</a></dt>
<dd><p>Change translation value.</p>
</dd>
<dt><a href="#updateTextureScale">updateTextureScale(scale)</a></dt>
<dd><p>Update texture scale value and redraw every shape.</p>
</dd>
<dt><a href="#setTextureScale">setTextureScale(scale)</a></dt>
<dd><p>Update texture scale value and calculate required settings.</p>
</dd>
<dt><a href="#updateTextureValues">updateTextureValues()</a></dt>
<dd><p>Reset some values calculated for texture by program. For 
example reset Base Translation of texture.</p>
</dd>
<dt><a href="#setTextureResolution">setTextureResolution(w, h)</a></dt>
<dd><p>Updates shader uniform that keeps textures resolution and
submit that in history.</p>
</dd>
<dt><a href="#setTextureResolutionVanilla">setTextureResolutionVanilla(w, h)</a></dt>
<dd><p>Updates shader uniform that keeps textures resolution and
doesn&#39;t submit that in history.</p>
</dd>
<dt><a href="#setShaderTextureResolution">setShaderTextureResolution(w, h)</a></dt>
<dd><p>Updates shader uniform that keeps textures resolution.</p>
</dd>
<dt><a href="#setTextureTranslationFromValuesToShader">setTextureTranslationFromValuesToShader()</a></dt>
<dd><p>Set texture translation value from local variables to shader&#39;s uniform</p>
</dd>
<dt><a href="#setBaseTextureTranslation">setBaseTextureTranslation(tx, ty)</a></dt>
<dd><p>Change texture&#39;s base translation and set it&#39;s value to shader&#39;s uniform.</p>
</dd>
<dt><a href="#setTextureUserTranslation">setTextureUserTranslation(tx, ty)</a></dt>
<dd><p>Set user-defined translation</p>
</dd>
<dt><a href="#setTextureTranslation">setTextureTranslation(tx, ty)</a></dt>
<dd><p>Change texture translation and set it&#39;s value to shader&#39;s uniform.
Calls <code>Drawer.setTextureTranslationVanilla(tx, ty)</code></p>
</dd>
<dt><a href="#setTextureTranslationVanilla">setTextureTranslationVanilla(tx, ty)</a></dt>
<dd><p>Change texture translation and set it&#39;s value to shader&#39;s uniform.</p>
</dd>
<dt><a href="#updateTranslation">updateTranslation(tx, ty)</a></dt>
<dd><p>Update vertex translation value and redraw every shape.</p>
</dd>
<dt><a href="#repeatTheHistory">repeatTheHistory()</a></dt>
<dd><p>Redraw any shape in history.</p>
</dd>
<dt><a href="#redraw">redraw()</a></dt>
<dd><p>Redraw any shape in history. (Call <code>Drawer.repeatTheHistory()</code> )</p>
</dd>
<dt><a href="#updateScaleIntoPoint">updateScaleIntoPoint(newScale, x, y)</a></dt>
<dd><p>Change scale centered on point P</p>
</dd>
<dt><a href="#createShader">createShader(type, source)</a> ⇒ <code>WebGLShader</code></dt>
<dd><p>Create WebGL shader object from given data.</p>
</dd>
<dt><a href="#createProgram">createProgram(vertexShader, fragmentShader)</a> ⇒ <code>WebGLProgram</code></dt>
<dd><p>Create WebGL program object from given data.</p>
</dd>
<dt><a href="#enableBlending">enableBlending(sfactor, dfactor, equationA)</a></dt>
<dd><p>Enable blending pixels</p>
</dd>
<dt><a href="#disableTextureBlending">disableTextureBlending()</a></dt>
<dd><p>Disable blending pixels</p>
</dd>
<dt><a href="#refitWebglToCanvas">refitWebglToCanvas()</a></dt>
<dd><p>Refit WebGL&#39;s clip space to new size of the canvas</p>
</dd>
<dt><a href="#setup">setup()</a></dt>
<dd><p>Initialize variables and uniforms</p>
</dd>
<dt><a href="#constructor">constructor(id, webglErrorFunction)</a></dt>
<dd><p>Construction Function</p>
</dd>
</dl>

<a name="vertexShaderSource"></a>

## vertexShaderSource
Vertex Shader

**Kind**: global variable  
<a name="fragmentShaderSource"></a>

## fragmentShaderSource
Fragment Shader

**Kind**: global variable  
<a name="Drawer"></a>

## Drawer(id, webglErrorFunction) ⇒ <code>Object</code>
Manages the drawing procedure

**Kind**: global function  
**Returns**: <code>Object</code> - Drawer object  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | id of canvas element |
| webglErrorFunction | <code>function</code> | callback function for when user cannot use webgl |

<a name="getMaximumTextureUnits"></a>

## getMaximumTextureUnits() ⇒ <code>integer</code>
**Kind**: global function  
**Returns**: <code>integer</code> - Maximum Texture Units Number  
<a name="setActiveTextureUnit"></a>

## setActiveTextureUnit(value) ⇒ <code>boolean</code>
Get a texture unit and activate it

**Kind**: global function  
**Returns**: <code>boolean</code> - if texture unit number is not in valid range return true otherwise return false  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>integer</code> | texture unit |

<a name="setTexture"></a>

## setTexture(image, unit, internalFormat, format)
Set image to specific texture unit

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | texture |
| unit | <code>integer</code> | texture unit |
| internalFormat | <code>GLenum</code> | a GLenum specifying the color components in the texture |
| format | <code>GLenum</code> | a GLenum specifying the format of the texel data |

<a name="setUseTexture"></a>

## setUseTexture(unit)
Set fragment shader to read texture from specific texture unit.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| unit | <code>integer</code> | texture unit |

<a name="setColorEnable"></a>

## setColorEnable()
Set fragment shader to read from active texture unit

**Kind**: global function  
<a name="setTextureEnable"></a>

## setTextureEnable()
Set fragment shader to read from color uniform

**Kind**: global function  
<a name="setColor"></a>

## setColor(r, g, b, a)
Set color to fragment shader and submit in the history

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="setColorVanilla"></a>

## setColorVanilla(r, g, b, a)
Set color to fragment shader but don't submit in the history

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="setPositions"></a>

## setPositions(positions)
Submit vertices to the Array Buffer and submited in the history

**Kind**: global function  

| Param | Type |
| --- | --- |
| positions | <code>\*</code> | 

<a name="setPositionsVanilla"></a>

## setPositionsVanilla(positions)
Submit vertices to the Array Buffer

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | array of vertices ``[x1, y1, x2, y2, ...]`` |

<a name="justDraw"></a>

## justDraw(positions)
Draw triangles that are passed.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | array of vertices ``[x1, y1, x2, y2, ...]`` |

<a name="draw"></a>

## draw(positions, r, g, b, a)
Draw triangles are passed with a specific color.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>\*</code> | array of vertices ``[x1, y1, x2, y2, ...]`` |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="drawFromBuffer"></a>

## drawFromBuffer(count)
Draw triangles in the Array Buffer

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| count | <code>integer</code> | number of vertices |

<a name="clear"></a>

## clear(r, g, b, a)
Clear screen with passed color and reset the history.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="setScale"></a>

## setScale(scale)
Change scale value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>number</code> | new scale |

<a name="updateScale"></a>

## updateScale(scale)
Change scale value and redraw every shape

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>number</code> | new scale |

<a name="setTranslation"></a>

## setTranslation(tx, ty)
Change translation value.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="updateTextureScale"></a>

## updateTextureScale(scale)
Update texture scale value and redraw every shape.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>number</code> | new scale value |

<a name="setTextureScale"></a>

## setTextureScale(scale)
Update texture scale value and calculate required settings.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>number</code> | new scale value |

<a name="updateTextureValues"></a>

## updateTextureValues()
Reset some values calculated for texture by program. For example reset Base Translation of texture.

**Kind**: global function  
<a name="setTextureResolution"></a>

## setTextureResolution(w, h)
Updates shader uniform that keeps textures resolution andsubmit that in history.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| w | <code>number</code> | width of texture |
| h | <code>number</code> | heigt of texture |

<a name="setTextureResolutionVanilla"></a>

## setTextureResolutionVanilla(w, h)
Updates shader uniform that keeps textures resolution anddoesn't submit that in history.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| w | <code>number</code> | width of texture |
| h | <code>number</code> | heigt of texture |

<a name="setShaderTextureResolution"></a>

## setShaderTextureResolution(w, h)
Updates shader uniform that keeps textures resolution.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| w | <code>number</code> | width of texture |
| h | <code>number</code> | heigt of texture |

<a name="setTextureTranslationFromValuesToShader"></a>

## setTextureTranslationFromValuesToShader()
Set texture translation value from local variables to shader's uniform

**Kind**: global function  
<a name="setBaseTextureTranslation"></a>

## setBaseTextureTranslation(tx, ty)
Change texture's base translation and set it's value to shader's uniform.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="setTextureUserTranslation"></a>

## setTextureUserTranslation(tx, ty)
Set user-defined translation

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="setTextureTranslation"></a>

## setTextureTranslation(tx, ty)
Change texture translation and set it's value to shader's uniform.Calls ``Drawer.setTextureTranslationVanilla(tx, ty)``

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="setTextureTranslationVanilla"></a>

## setTextureTranslationVanilla(tx, ty)
Change texture translation and set it's value to shader's uniform.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="updateTranslation"></a>

## updateTranslation(tx, ty)
Update vertex translation value and redraw every shape.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>number</code> | X value of translation |
| ty | <code>number</code> | Y value of translation |

<a name="repeatTheHistory"></a>

## repeatTheHistory()
Redraw any shape in history.

**Kind**: global function  
<a name="redraw"></a>

## redraw()
Redraw any shape in history. (Call ``Drawer.repeatTheHistory()`` )

**Kind**: global function  
<a name="updateScaleIntoPoint"></a>

## updateScaleIntoPoint(newScale, x, y)
Change scale centered on point P

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| newScale | <code>number</code> |  |
| x | <code>number</code> | x value of P |
| y | <code>number</code> | y value of P |

<a name="createShader"></a>

## createShader(type, source) ⇒ <code>WebGLShader</code>
Create WebGL shader object from given data.

**Kind**: global function  
**Returns**: <code>WebGLShader</code> - webgl shader object  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>number</code> | gl.VERTEX_SHADER or gl.FRAGMENT_SHADER |
| source | <code>string</code> | GLSL source code of shader |

<a name="createProgram"></a>

## createProgram(vertexShader, fragmentShader) ⇒ <code>WebGLProgram</code>
Create WebGL program object from given data.

**Kind**: global function  
**Returns**: <code>WebGLProgram</code> - webgl program object  

| Param | Type | Description |
| --- | --- | --- |
| vertexShader | <code>WebGLShader</code> | vertex shader |
| fragmentShader | <code>WebGLShader</code> | fragment shader |

<a name="enableBlending"></a>

## enableBlending(sfactor, dfactor, equationA)
Enable blending pixels

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sfactor | <code>GLenum</code> | a ``GLenum`` specifying a multiplier for the source blending factors |
| dfactor | <code>GLenum</code> | a ``GLenum`` specifying a multiplier for the destination blending factors |
| equationA | <code>GLenum</code> | a ``GLenum`` specifying how source and destination colors are combined |

<a name="disableTextureBlending"></a>

## disableTextureBlending()
Disable blending pixels

**Kind**: global function  
<a name="refitWebglToCanvas"></a>

## refitWebglToCanvas()
Refit WebGL's clip space to new size of the canvas

**Kind**: global function  
<a name="setup"></a>

## setup()
Initialize variables and uniforms

**Kind**: global function  
<a name="constructor"></a>

## constructor(id, webglErrorFunction)
Construction Function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | id of canvas element |
| webglErrorFunction | <code>function</code> | callback function for when user cannot use webgl |



