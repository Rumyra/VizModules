# VizTile

Creates a 'tile' (collected group of Canvas 2D shapes) to be drawn on a canvas.

[See it working](example)


## Include

To include in your project just clone/download/copy VizTile.js and import it into your js module file:

`import VizTile from './VizTile.js'`

## Basic usage

Create a new tile:

`const tile = new VizTile()`

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

