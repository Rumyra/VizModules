### Fill styles

#### `VizCanvas.fillDots(dotCol = '#111', bgCol = '#eee', size = 16)`

**Returns** CanvasPattern

Returns a `CanvasPattern` of dots in an iso distribution. The result can be used as a `fillStyle`.

Takes three parameters:

- `dotCol` {color} colour of the dots.
- `bgCol` {color} colour of the pattern background.
- `size` {int} size of dots.

```
const dotPattern = VizCanvas.fillDots('black', 'white', 12);
canvas.fillStyle = dotPattern;
```

#### `VizCanvas.fillDotGrid(dotCol = '#111', bgCol = '#eee', size = 16)`

**Returns** CanvasPattern

Returns a `CanvasPattern` of dots in a square distribution. The result can be used as a `fillStyle`.

Takes three parameters:

- `dotCol` {color} colour of the dots.
- `bgCol` {color} colour of the pattern background.
- `size` {int} size of dots.

```
const dotGridPattern = VizCanvas.fillDotGrid('black', 'white', 12);
canvas.fillStyle = dotGridPattern;
```

#### `VizCanvas.fillLines(lineCol = '#111', bgCol = '#eee', size = 8, lineWidth = 4, rotation = 0)`

**Returns** CanvasPattern

Returns a `CanvasPattern` of lines. The result can be used as a `fillStyle`.

Takes five parameters:

- `lineCol` {color} colour of the lines.
- `bgCol` {color} colour of the pattern background.
- `size` {int} width of one line to the next.
- `lineWidth` {int} width of the lines.
- `rotation` {int} By default the lines are vertical, this rotates them. Value is in **radians**.

```
const linePattern = VizCanvas.fillLines('black', 'white', 12, 6, Math.PI/4);
canvas.fillStyle = linePattern;
```

As this is a repeated pattern it works best at 45 degree increments (Math.PI/4 in radians). However you can create some interesting textures by changing the size, line width & rotation.

#### `VizCanvas.fillGrid(lineCol = '#111', bgCol = '#eee', size = 8, lineWidth = 4, rotation = 0)`

**Returns** CanvasPattern

Returns a `CanvasPattern` of two lines in a cross shape, thus making a grid texture. The result can be used as a `fillStyle`.

Takes five parameters:

- `lineCol` {color} colour of the lines.
- `bgCol` {color} colour of the pattern background.
- `size` {int} width of one line to the next.
- `lineWidth` {int} width of the lines.
- `rotation` {int} By default the lines are vertical, this rotates them. Value is in radians.

```
const gridPattern = VizCanvas.fillGrid('black', 'white', 12, 6, Math.PI/4);
canvas.fillStyle = gridPattern;
```

As this is a repeated pattern it works best at 45 degree increments (Math.PI/4 in radians). However you can create some interesting textures by changing the size, line width & rotation (try Math.PI/3 for a houndstooth pattern).

#### `VizCanvas.fillCheckered(lineCol = '#111', bgCol = '#eee', size = 8)`

**Returns** CanvasPattern

Returns a `CanvasPattern` of a checkered square pattern. The result can be used as a `fillStyle`.

Takes three parameters:

- `lineCol` {color} colour of the lines.
- `bgCol` {color} colour of the pattern background.
- `size` {int} width of one line to the next.

```
const checkPattern = VizCanvas.fillCheckered('black', 'white', 12);
canvas.fillStyle = checkPattern;
```

#### `VizCanvas.filLinearGrad(colourOne = '#111', colorTwo = '#eee', size = 50)`

**Returns** CanvasGradient

Returns a `CanvasGradient` of a simple fade from one colour to the next. The result can be used as a `fillStyle`.

Takes three parameters:

- `colourOne` {color} start colour of gradient.
- `colourTwo` {color} end colour of gradient.
- `size` {int} size of the gradient.

```
const gradient = VizCanvas.fillLinearGrad('black', 'white', 12);
canvas.fillStyle = gradient;
```

