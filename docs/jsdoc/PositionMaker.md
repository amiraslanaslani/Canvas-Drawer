# PositionMaker

## Members

<dl>
<dt><a href="#positions">positions</a></dt>
<dd><p>The array that contains the vertices of the triangles</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#PositionMaker">PositionMaker()</a> ⇒ <code>Object</code></dt>
<dd><p>The part of the system that converts complex shapes to 
triangles that can drawn by ‍‍<code>Drawer</code></p>
</dd>
<dt><a href="#reset">reset()</a></dt>
<dd><p>Reset all values</p>
</dd>
<dt><a href="#addPolygon">addPolygon(vertices)</a></dt>
<dd><p>Get array of values and add represented polygon to <code>PositionMaker.positions</code>.</p>
</dd>
<dt><a href="#addLine">addLine(x1, y1, x2, y2, width)</a></dt>
<dd><p>Add a line between P<sub>1</sub> and P<sub>2</sub> to <code>PositionMaker.positions</code>.</p>
</dd>
<dt><a href="#addCircle">addCircle(cx, cy, r, cuts)</a></dt>
<dd><p>Add a circle that centered on <code>P</code> with radius of <code>R</code> to <code>PositionMaker.positions</code>.</p>
</dd>
<dt><a href="#addRectangle">addRectangle(x1, y1, x2, y2)</a></dt>
<dd><p>Add a rectangle P<sub>1</sub>P<sub>2</sub>P<sub>3</sub>P<sub>4</sub> to <code>PositionMaker.positions</code>.</p>
</dd>
<dt><a href="#addSequenceLine">addSequenceLine(positions, width)</a></dt>
<dd><p>Add multiple lines to <code>PositionMaker.positions</code></p>
</dd>
<dt><a href="#addClosedSequenceLine">addClosedSequenceLine(positions, width)</a></dt>
<dd><p>Add multiple lines to <code>PositionMaker.positions</code> and closed lines.</p>
</dd>
<dt><a href="#getPositionsList">getPositionsList()</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>Returns the array that contains the vertices of the triangles</p>
</dd>
</dl>

<a name="positions"></a>

## positions
The array that contains the vertices of the triangles

**Kind**: global variable  
<a name="PositionMaker"></a>

## PositionMaker() ⇒ <code>Object</code>
The part of the system that converts complex shapes to triangles that can drawn by ‍‍``Drawer``

**Kind**: global function  
**Returns**: <code>Object</code> - PositionMaker object  
<a name="reset"></a>

## reset()
Reset all values

**Kind**: global function  
<a name="addPolygon"></a>

## addPolygon(vertices)
Get array of values and add represented polygon to ``PositionMaker.positions``.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| vertices | <code>Array.&lt;number&gt;</code> | sequence of ``X``s and ``Y``s of vertices of polygon. For example ``[0,0, 50,0, 50,50, 0,50]`` represents an square |

<a name="addLine"></a>

## addLine(x1, y1, x2, y2, width)
Add a line between P<sub>1</sub> and P<sub>2</sub> to ``PositionMaker.positions``.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>number</code> | X of P<sub>1</sub> |
| y1 | <code>number</code> | Y of P<sub>1</sub> |
| x2 | <code>number</code> | X of P<sub>2</sub> |
| y2 | <code>number</code> | Y of P<sub>2</sub> |
| width | <code>number</code> | width of line |

<a name="addCircle"></a>

## addCircle(cx, cy, r, cuts)
Add a circle that centered on ``P`` with radius of ``R`` to ``PositionMaker.positions``.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| cx | <code>number</code> | X of P |
| cy | <code>number</code> | Y of P |
| r | <code>number</code> | radius |
| cuts | <code>integer</code> | number of triangles to draw circle |

<a name="addRectangle"></a>

## addRectangle(x1, y1, x2, y2)
Add a rectangle P<sub>1</sub>P<sub>2</sub>P<sub>3</sub>P<sub>4</sub> to ``PositionMaker.positions``.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>number</code> | X of P<sub>1</sub> |
| y1 | <code>number</code> | Y of P<sub>1</sub> |
| x2 | <code>number</code> | X of P<sub>3</sub> |
| y2 | <code>number</code> | Y of P<sub>3</sub> |

<a name="addSequenceLine"></a>

## addSequenceLine(positions, width)
Add multiple lines to ``PositionMaker.positions``

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | sequence of vetices of line. For example ``[0,0, 100,0, 100,50]`` represents an L shape line |
| width | <code>number</code> | line width |

<a name="addClosedSequenceLine"></a>

## addClosedSequenceLine(positions, width)
Add multiple lines to ``PositionMaker.positions`` and closed lines.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| positions | <code>Array.&lt;number&gt;</code> | sequence of vetices of line. For example ``[0,0, 100,0, 100,50]`` represents an triangle shaped line |
| width | <code>number</code> | line width |

<a name="getPositionsList"></a>

## getPositionsList() ⇒ <code>Array.&lt;number&gt;</code>
Returns the array that contains the vertices of the triangles

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - ``PositionMaker.positions``  


