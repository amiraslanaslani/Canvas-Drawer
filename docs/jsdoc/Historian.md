# Historian

## Members

<dl>
<dt><a href="#memo">memo</a></dt>
<dd><p>Memory object that maps keys to memories.</p>
</dd>
<dt><a href="#keys">keys</a></dt>
<dd><p>Array of submited Keys.</p>
</dd>
<dt><a href="#key">key</a></dt>
<dd><p>Value of current key.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#Historian">Historian()</a> ⇒ <code>Object</code></dt>
<dd><p>The part of the system that holds history</p>
</dd>
<dt><a href="#clone">clone()</a> ⇒ <code>Object</code></dt>
<dd><p>Get clone of this Historian object</p>
</dd>
<dt><a href="#getDataCopy">getDataCopy()</a> ⇒ <code>Object</code></dt>
<dd><p>Get clone of all data saved in this historian</p>
</dd>
<dt><a href="#addKey">addKey(key)</a></dt>
<dd><p>Add empty key.</p>
</dd>
<dt><a href="#submit">submit(positions, key)</a></dt>
<dd><p>Submit passed vertices for passed key</p>
</dd>
<dt><a href="#submitVanilla">submitVanilla(positions)</a></dt>
<dd><p>Submit passed vertices for current key ( <code>Historian.key</code> )</p>
</dd>
<dt><a href="#setKey">setKey(key)</a></dt>
<dd><p>Set key to current key ( <code>Historian.key</code> )</p>
</dd>
<dt><a href="#forget">forget()</a></dt>
<dd><p>Clear the history</p>
</dd>
<dt><a href="#getMemo">getMemo()</a> ⇒ <code>Object</code></dt>
<dd><p>returns <code>Historian.memo</code></p>
</dd>
<dt><a href="#getKeys">getKeys()</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>returns <code>Historian.keys</code></p>
</dd>
</dl>

<a name="memo"></a>

## memo
Memory object that maps keys to memories.

**Kind**: global variable  
<a name="keys"></a>

## keys
Array of submited Keys.

**Kind**: global variable  
<a name="key"></a>

## key
Value of current key.

**Kind**: global variable  
<a name="Historian"></a>

## Historian() ⇒ <code>Object</code>
The part of the system that holds history

**Kind**: global function  
**Returns**: <code>Object</code> - Historian object  
<a name="clone"></a>

## clone() ⇒ <code>Object</code>
Get clone of this Historian object

**Kind**: global function  
**Returns**: <code>Object</code> - cloned historian object  
<a name="getDataCopy"></a>

## getDataCopy() ⇒ <code>Object</code>
Get clone of all data saved in this historian

**Kind**: global function  
**Returns**: <code>Object</code> - clone of all data saved in this historian  
<a name="addKey"></a>

## addKey(key)
Add empty key.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | key |

<a name="submit"></a>

## submit(positions, key)
Submit passed vertices for passed key

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | array of vertices |
| key | <code>string</code> | key |

<a name="submitVanilla"></a>

## submitVanilla(positions)
Submit passed vertices for current key ( ``Historian.key`` )

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | array of vertices |

<a name="setKey"></a>

## setKey(key)
Set key to current key ( ``Historian.key`` )

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 

<a name="forget"></a>

## forget()
Clear the history

**Kind**: global function  
<a name="getMemo"></a>

## getMemo() ⇒ <code>Object</code>
returns ``Historian.memo``

**Kind**: global function  
**Returns**: <code>Object</code> - memory  
<a name="getKeys"></a>

## getKeys() ⇒ <code>Array.&lt;string&gt;</code>
returns ``Historian.keys``

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - keys  


