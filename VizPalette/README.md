# VizPalette

Returns an array of colours (in hexadecimal string format) based on an input of one colour or an array.

[See it working](example)

The use case for this was fill & stroke styles with the Canvas API. There is an extra class `VizFill` included but not exported, `VizPalette` utilises it to create `CanvasPatterns` & `CanvasGradients` to add to the palette.

## Include

To include in your project just clone/download/copy VizPalette.js and import it into your js module file:

`import VizPalette from './VizPalette.js'`

## Basic usage

Create a new palette:

`const palette = new VizPalette()`

If no options object is specified, a palette is randomly generated and returned.

An optional options object can be passed in (see below for more):

`const palette = new VizPalette(options)`

An array of colours as hex values in returned:

> The default string format may change in the future depending on browser colour spaces, however it will always be something you can use as is (ie a format that CSS, SVG & Canvas all recognise).

```
console.log(palette)

// ['#fe4672', '#ca3267', '#d28574', '#a2e456']
```

## Options & matching properties

### The options object

The following are the default options:

```
const options = {
	input: random color,
	paletteType: 'tetrad',
	darkBg: true
}
```

All options are exposed as properties which are explained below.

### `input` property {string | array} _default: random colour_

If no `input` is specified, a randomly generated colour is used.

This property takes one colour or an array of colours:

#### One colour

One colour will generate colours for a palette depending on the `paletteType` property (which defaults to `tetrad` - see below).

```
input: 'red'
```

#### Colour array

You can use an array of pre-determined colours - which may seem a little contrived as this is what is returned, however there are added properties and methods to `VizPalette` which are not available with a regular array of strings.

The input colours can be of any type.

```
input: ['#fe4672', 'rgb(156, 0, 234', '#d28574', 'hsla(200, 50%, 50%, 1)']
```

### `paletteType` property {string} _default: 'tetrad'_

If a palette is automatically generated with _no_ `input` option, or _only one_ colour as the `input`, the palette type can also be specified. Each palette type returns either five or six colours, one of which is very dark and one very light.

This can be one of:

- `'tetrad'` _default_: Six colours, one original, one very dark, one very light and three additional which are tetrad compliments of the input.
- `'same'`: Five colours, one original, one very dark, one very light and two additional similar to the input.
- `'split'` Five colours, one original, one very dark, one very light and two additional which are split compliments of the input.
- `'triad'` Five colours, one original, one very dark, one very light and two additional which are triad compliments of the input.

If an array is used for the `input` option, this property has no effect.

### `darkBg` property {boolean} _default: true_

A `bg` (background) and `fg` (foreground) property are exposed as part of the returned `VizPalette` (see more below). The `darkBg` option/property dictates whether the `bg` is the darkest colour of the palette (when set to `true`), or the lightest (when set to `false`).

```
darkBg: false // VizPalette.bg is the lightest colour
```

## Properties

### `bg` property {string} _Readonly_

Returns the background colour as a hexadecimal string. Depends on `darkBg`.

```
console.log(palette.bg); // hex string
```

### `fg` property {string} _Readonly_

Returns the foreground colour as a hexadecimal string. Depends on `darkBg`.

```
console.log(palette.fg); // hex string
```

## Methods

### `luminate(amount)` _float between -1 & 1_

This adjust the lightness and darkness of the palette. Set to a float value between -1 & 1.

If a value between -1 & 0 is used, the palette will darken. -1 will make all the colours black.

If a value between 0 & 1 is used the palette will lighten. 1 will make all the colours white.

### `saturate(amount)` _float between -1 & 1_

This adjust the saturation of the palette. It accepts a float value between -1 & 1.

If a value between -1 & 0 is used, the palette will desaturate. -1 will make all the colours grey.

If a value between 0 & 1 is used the palette will saturate.

### `spin(amount)` _float between -1 & 1_

Adjusts the hue of the palette. -1, 0 & 1 will have no effect as they are the hue points of the current palette.

### `setAlpha(amount)` _float between 0 & 1_

Modifies the alpha value of the colours in the palette, making them transparent. Full transparency happens when the amount is 0. Full opacity at 1.

### `brighten(amount)` _float between 0 & 1_

Modifies the brightness of the colours in the palette.

### `addFill(opts = {})`

Adds a `VizFill` (see below) to the palette.

```
palette.addFill();

console.log(palette); // ['#111', '#efe', CanvasPattern]
```

Takes an optional options object with the following properties:

- `type` _default 'dots'_ The type of pattern or gradient. Can be one of:
	- `'dots'` _default_: A `CanvasPattern` of dots.
	- `'dotgrid'`: A `CanvasPattern` a dot grid.
	- `'stripes'`: A stripey `CanvasPattern`.
	- `'grid'`: A line grid `CanvasPattern`.
	- `'checkered'`: A checkered `CanvasPattern`.
	- `'lgradient'`: A linear `CanvasGradient`.
- `fgCol` _default '#fefefe'_ A CSSColor type
- `bgCol` _default '#111'_ A CSSColor type
-	`size` _default 24_ An integer which changes the size of the repeatable part of the pattern
- `ratio` _default 1_ A float which modifies the ratio of the pattern

[For more about the `VizFill` class see below](#VizFill)

There currently is no way to remove a fill, other than to pop it out of the array (they'll be added last).

Another option is to reset the palette



### `reset()`

Returns the palette to the original generation.

### `generatePalette()`

(Re)Generates the palette.

# VizFill

`VizPalette` includes a class called `VizFill` which is used to create the canvas pattern or gradient fills. This class is not exported with the module but can easily be modified to.

> VizFill can easily be pulled out and made into it's own module, but as it's sole use within my eco system is for the palette, I've kept them together.

The following describes how to use `VizFill` as if it were it's own module. When the `addPattern()` method of `VizPalette` is used, a `VizFill` is returned.

## Basic usage

Create a new fill:

`const fill = new VizFill()`

If no options object is specified, a `dots` type pattern is returned.

An optional options object can be passed in (see below for more):

`const fill = new VizFill(options)`

Either a `CanvasPattern` or a `CanvasGradient` is returned, depending on the `type` specified. Each pattern takes two colours, one for the foreground and one for the background. A `size` for th repeatable part of the pattern can be specified, as can a `ratio` to adjust the pattern.

## Options & matching properties

### The options object

The following are the default options:

```
const options = {
	type: 'dots'
	fgCol: '#fefefe',
	darkBg: '#111',
	size: 24,
	ratio: 1,
}
```

All options are exposed as properties which are explained below.

### `type` property {string} _default: 'dots'_

This can be one of:

- `'dots'` _default_: A `CanvasPattern` of dots.
- `'dotgrid'`: A `CanvasPattern` a dot grid.
- `'stripes'`: A stripey `CanvasPattern`.
- `'grid'`: A line grid `CanvasPattern`.
- `'checkered'`: A checkered `CanvasPattern`.
- `'lgradient'`: A linear `CanvasGradient`.

You can set & return the property:

```
fill.type = 'dotgrid';
console.log(fill.type) // 'dotgrid';
```

### `fgCol` property {string} _default: '#fefefe'_

The foreground colour for the pattern.

```
fill.fgCol = 'red';
console.log(fill.fgCol) // 'red';
```

### `bgCol` property {string} _default: '#111'_

The background colour for the pattern.

```
fill.bgCol = 'blue';
console.log(fill.bgCol) // 'blue';
```

### `size` property {int} _default: 16_

The size of the pattern. 

```
fill.size = 20;
console.log(fill.size) // 20
```

### `ratio` property {float} _default: 1_

The ratio of the pattern.

```
fill.ratio = 0.5;
console.log(fill.ratio) // 0.5
```

