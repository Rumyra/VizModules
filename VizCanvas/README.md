# VizCanvas

**VizCanvas** creates a fullscreen, 2d context canvas when instantiated. It exposes some properties & methods for working with the Canvas API.

[See it working](example)

> Old versions of this class used to take width, height and specify which element to append the new canvas too. Whilst I might add this back in if I deem it useful, I never used these features, so pulled them out for simplification.

## Getting started

To create a new VizCanvas, and thus canvas element, import into your script:

```
import VizCanvas from './VizCanvas.js';
```

Create a new canvas (this is appended to the `body` element of your html file):

```
const canvas = new VizCanvas();
```

This will automatically create a fullscreen canvas, within your html page. A 'wrapper' `div` element is created around the `canvas` element, and styled accordingly.

The pixel size of the canvas takes into account `pixelAspectRatio` so 1 CSS pixel of the browser window might be 2.3 canvas pixels. This is reflected in the `width`, `height` and other measurement properties. It means the canvas works at a _really nice shiny_ resolution.

### `options`

```
const canvasOptions = {
	bgCol: '#111'
}
```

#### `bgCol`

Sets the background colour of the canvas. Accepts an colour in the CSS color format (hex, rgb, hsl etc...).

### Resize

The element and its dimensions will automatically resize with the browser. Bear in mind when the width & height properties of a canvas element change, the canvas is reset, so this _will_ result in a blank canvas.

However if you are using `requestAnimationFrame` or similar animating techniques, this should not be a problem.

### Context

When the class is instantiated a 2d context is created, accessed via the `ctx` property (see below). Settings for this context are also set up (they can be over-ridden via the `ctx` property). The settings which are different to the default are:

```
canvas.ctx.imageSmoothingQuality = 'high';
canvas.ctx.lineCap = 'round';
canvas.ctx.lineJoin = 'round';
canvas.ctx.lineWidth = 3.0;
```

## Properties

### `bgCol` {string}

A background colour can be set via the `bgCol` property. It accepts a string matching a CSS colour (name, hex, rgb, hsl etc...).

```
canvas.bgCol = 'pink';
```

**Default** `'#111`. This is a tiny bit lighter than black, because this is _my_ go to, but can be set to anything.

To set the background colour, a rectangle is drawn over the whole canvas and filled with the specified colour. This happens on instantiation, but if this property is set after then the `clear()` method (see below) needs to be called and a little note of warning this will 'clear' the canvas with the new colour (ie; draw a whole new rectangle over everything).

> Honest I went down a rabbit hole with this and there's no _easy_ way to do it. If you're animating you'll be calling `clear()` anyway... so.

### `wrapper` {node} _readonly_

Returns the `div` element the canvas is wrapped in.

```
const divElement = canvas.wrapper;
```

### `canvas` {node} _readonly_

Returns the `canvas` element.

```
const canvasElement = canvas.canvas;
```

### `ctx` {context} _readonly_

Returns the 2d context of the created canvas, for drawing.

```
const 2Dcontext = canvas.ctx;
```

### `dpr` {float} _readonly_

Returns the device pixel ratio (basically just `window.devicePixelRatio` but it's just easier to type).

```
console.log(canvas.dpr); // 2.13
```

### `width` {int} _readonly_

Returns the width of the canvas in pixels. Takes into account `window.devicePixalRatio`.

```
console.log(canvas.width); // 2134
```

### `height` {int} _readonly_

Returns the height of the canvas in pixels. Takes into account `window.devicePixalRatio`.

```
console.log(canvas.height); // 1534
```

### `cx` {int} _readonly_

Returns the horizontal center point of the canvas in pixels. Uses the `width` property.

```
console.log(canvas.cx); // 1067
```

### `cy` {int} _readonly_

Returns the vertical center point of the canvas in pixels. Uses the `height` property.

```
console.log(canvas.cy); // 1067
```

## Methods

### `clear(bgCol = '#111')`

Draws & fills a rectangle over the entire canvas. Accepts a colour parameter as a CSS colour string (name, hex, rgb, hsl etc...).

```
canvas.clear('hsla(100, 50%, 50%, 1)')
```

Note this also changes the `bgCol` property to whatever colour is specified. If no colour is specified, the current `bgCol` property is used.

```
canvas.bgCol = 'grey';
canvas.clear(); // turns the canvas grey
```

## Filters

These set a _CSS_ filter over the entire canvas. Each filter is set via a property, which can also be read to return the current amount.

All filters accept a value between -1 & 1, values outside of this range will be clamped.

> I've tried to keep the values for each filter consistent. For some filters, minus values make no difference.

Filters are applied in the order below.

### `brightness` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no brightness change).

This brightens or darkens the canvas by the amount set. 

```
canvas.brightness = 0.2; // lighter
canvas.brightness = -0.2; // darker
```

### `contrast` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no contrast change).

This increases or decreases the canvas contrast by the amount set. 

```
canvas.contrast = 0.2; // higher contrast
canvas.contrast = -0.2; // lower contrast
```

### `sepia` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no sepia).

This adds a sepia effect to the canvas. If a minus value is set the sepia amounts to `0` and has no effect.

```
canvas.sepia = 0.2; // some sepia
canvas.sepia = 1; // full sepia
```

### `saturation` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no saturation change).

This increases or decreases the saturation of canvas by the amount set.

```
canvas.saturation = 0.2; // higher saturation
canvas.saturation = -0.2; // lower saturation
```

### `hueRotate` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no hue change).

This rotates the hue of the canvas by the amount set. Values between 0 & 1 map to degrees 0 -> 360, and conversely 0 & -1 to 0 -> -360. This means you can go forward or backward through hues.

```
canvas.hueRotate = 0.2; // shift reds, through oranges, to yellows
canvas.hueRotate = -0.2; // shift reds, through pinks, to purples
```

### `blur` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no blur).

This blurs the canvas by the amount set. If a minus value is set the blur amounts to `0` and has no effect.

```
canvas.blur = 0.2;
```

### `invert` {float}

Accepts values between -1 & 1. **Initial Value** `0` (no invert).

This inverts the canvas by the amount set. If a minus value is set the invert amounts to `0` and has no effect.

```
canvas.invert = 0.2;
```


