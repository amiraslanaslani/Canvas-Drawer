# HistoryManager

## Members

<dl>
<dt><a href="#historian">historian</a></dt>
<dd><p>Historian object</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#HistoryManager">HistoryManager(historian)</a> ⇒ <code>Object</code></dt>
<dd><p>The part of the system that connects <code>Drawer</code> to <code>Historian</code>.</p>
</dd>
<dt><a href="#setColor">setColor(r, g, b, a)</a></dt>
<dd><p>Set current color to historian</p>
</dd>
<dt><a href="#updateTextureKey">updateTextureKey()</a></dt>
<dd><p>Update the historian&#39;s key with current texture values</p>
</dd>
<dt><a href="#setTextureSlut">setTextureSlut(unit)</a></dt>
<dd><p>Announced current texture&#39;s unit number to historian</p>
</dd>
<dt><a href="#setTextureResolution">setTextureResolution(w, h)</a></dt>
<dd><p>Announced current texture&#39;s resolution to historian</p>
</dd>
<dt><a href="#setTextureTranslation">setTextureTranslation(x, y)</a></dt>
<dd><p>Announced current texture&#39;s translation to historian</p>
</dd>
<dt><a href="#submitVanilla">submitVanilla(positions)</a></dt>
<dd><p>Submit passed vertices for current key ( <code>HistoryManager.historian.key</code> )</p>
</dd>
<dt><a href="#forget">forget()</a></dt>
<dd><p>Clear the history
Calls <code>HistoryManager.historian.forget()</code></p>
</dd>
<dt><a href="#getKeys">getKeys()</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>returns keys set of historian</p>
</dd>
<dt><a href="#getMemo">getMemo()</a> ⇒ <code>Object</code></dt>
<dd><p>returns memory of historian</p>
</dd>
</dl>

<a name="historian"></a>

## historian
Historian object

**Kind**: global variable  
<a name="HistoryManager"></a>

## HistoryManager(historian) ⇒ <code>Object</code>
The part of the system that connects ``Drawer`` to ``Historian``.

**Kind**: global function  
**Returns**: <code>Object</code> - HistoryManager object  

| Param | Type | Description |
| --- | --- | --- |
| historian | <code>Object</code> | Historian object |

**Example**  
```js
var hm = new HistoryManager(     new Historian(););
```
<a name="setColor"></a>

## setColor(r, g, b, a)
Set current color to historian

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>integer</code> | red color in range 0-1 |
| g | <code>integer</code> | green color in range 0-1 |
| b | <code>integer</code> | blue color in range 0-1 |
| a | <code>integer</code> | alpha color in range 0-1 |

<a name="updateTextureKey"></a>

## updateTextureKey()
Update the historian's key with current texture values

**Kind**: global function  
<a name="setTextureSlut"></a>

## setTextureSlut(unit)
Announced current texture's unit number to historian

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| unit | <code>integer</code> | texture unit |

<a name="setTextureResolution"></a>

## setTextureResolution(w, h)
Announced current texture's resolution to historian

**Kind**: global function  

| Param | Type |
| --- | --- |
| w | <code>number</code> | 
| h | <code>number</code> | 

<a name="setTextureTranslation"></a>

## setTextureTranslation(x, y)
Announced current texture's translation to historian

**Kind**: global function  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="submitVanilla"></a>

## submitVanilla(positions)
Submit passed vertices for current key ( ``HistoryManager.historian.key`` )

**Kind**: global function  

| Param | Type |
| --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | 

<a name="forget"></a>

## forget()
Clear the historyCalls ``HistoryManager.historian.forget()``

**Kind**: global function  
<a name="getKeys"></a>

## getKeys() ⇒ <code>Array.&lt;string&gt;</code>
returns keys set of historian

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - keys  
<a name="getMemo"></a>

## getMemo() ⇒ <code>Object</code>
returns memory of historian

**Kind**: global function  
**Returns**: <code>Object</code> - memory  


