# VizPalette

Returns an array of colours & Canvas API fills with extra methods & properties.

The use case for this was fill & stroke styles with the Canvas API, however can be configured to just return a palette of colours for use anywhere.

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
	darkBg: true,
	includeFills: false
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

You can use an array of pre-determined colours - which may seem a little contrived as this is what is returned, however there are added properties and methods to this approach.

The input colours can be of any type.

```
input: ['#fe4672', 'rgb(156, 0, 234', '#d28574', 'hsla(200, 50%, 50%, 1)']
```

### `paletteType` property {string} _default: 'tetrad'_

If a palette is automatically generated with no `input` option, or only one colour as the `input`, the palette type can also be specified. Each palette type returns either five or six colours, one of which is very dark and one very light.

This can be one of:

- `'tetrad'` _default_: Six colours, one original, one very dark, one very light and three additional which are tetrad compliments of the input.
- `'same'`: Five colours, one original, one very dark, one very light and two additional similar to the input.
- `'split'` Five colours, one original, one very dark, one very light and two additional which are split compliments of the input.
- `'triad'` Five colours, one original, one very dark, one very light and two additional which are triad compliments of the input.


If an array is used for the `input` option, this property has no effect.

ADD DARK BACKGOUND HERE



## Properties


## Methods

### `addFill`

### `removeBg`

# VizFill

VizPalette includes a class called VizFill which is used to create the canvas pattern or gradient fills.

> VizFill can easily be pulled out and made into it's own module, but as it's sole use within my eco system is for the palette, I've kept them together.

The following describes how to use VizFill as if it were it's own module. When the `addPattern()` method of `VizPalette` is used, a `VizFill` is returned.

## Basic usage

Create a new fill:

`const fill = new VizFill()`

If no options object is specified, a `dots` type pattern is returned.

An optional options object can be passed in (see below for more):

`const fill = new VizFill(options)`

Either a `CanvasPattern` or a `CanvasGradient` is returned, depending on the `type` specified. Each pattern takes two colours, one for the foreground and one for the background. Two sizes can be specified `psize` and `dsize` - these stand for 'pattern size' and 'detail size' retrospectively. See below for more.

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

When used within VizPalette this defaults to the palettes foreground colour.

### `bgCol` property {string} _default: '#111'_

The background colour for the pattern.

```
fill.bgCol = 'blue';
console.log(fill.bgCol) // 'blue';
```

When used within VizPalette this defaults to the palettes background colour.

### `size` property {int} _default: 16_

The size of the pattern. 

```
fill.size = 20;
console.log(fill.size) // 20
```

