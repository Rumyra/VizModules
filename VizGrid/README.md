# VizGrid

JS Module that returns a map of grid coordinates, based on different settings. This module was designed to be used with frontend JavaScript, as an ES6 module.

[See it working](example)

**VizGrid** automatically calculates points to fill an area. There are plenty of options to manipulate how spaced out these points should be, a ratio to change the default 'square' grid, as well as an offset for isometric grids.

You can also change the type of the grid from cartesian (default) to polar (see below for more).

> **NB** At this time only 'cartesian' has been implemented - see the issue tracker.

> My use case for this is almost always generative canvas stuff, however, as it just returns a map of (x, y) coordinates it can be used for any grid displaying.

## Include

To include in your project just clone/download/copy VizGrid.js and import it into your js module file:

`import VizGrid from './VizGrid.js'`

## Basic usage

Create a new grid:

`const grid = new VizGrid()`

An options object can be passed in (see below for more):

`const grid = new VizGrid(options)`

A map of coordinates is returned:

```
for (const coord of grid) {
	console.log(coord.x) // x pixel
	console.log(coord.y) // y pixel
}
```

## What does the map look like?

The returned object extends `Map` so comes with all the regular features of a map like object in JavaScript.

Each item of the map looks like this:

```
key: [3, 8]
value: {
	x: 348,
	y: 74,
	alive: true,
	dc: { x: 0.78, y: 0.12, av: 0.45 }
}

```

The key represents which number coordinate is represented. The two values represent horizontal and vertical. The default is to start at the top left of the area and read left to right, top to bottom. So the first coordinate would be [0, 0] and the second [1, 0] The direction/order can be altered and manipulated via options. This differs if you state a polar grid vs a cartesian grid (the default). See below for more details.

> This may seem a bit convoluted but worth noting the key *does not* represent the pixel coordinates. This actually makes it a lot easier to manipulate each point, and change the order of them (useful for animations).

The value is an object with four properties. `x`, `y`, `dc` and `alive`. `x` and `y` represent the pixel value of the horizontal and vertical position. `dc` is an object which represents how far a coordinate is from the `center` of the grid (See the `center` property below for more). `alive` is set when `dither` is used and can be tested to see whether you want to draw for that coordinate or not.

> Remember because its a map object, manipulating the items needs to happen with `get()`, `set()`, `has()`, `delete()` etc...

## Options & matching properties

### The options object

Options (and the rendered grid) differ when creating a cartesian grid or a polar grid. By default a cartesian grid is returned. The following are the default options:

```
const options = {
	type: 'cartesian',
	width: 1200,
	height: 800,
	spacing: 0.5,
	padding: false,
	ratio: 1,
	axis: 'x',
	offset: 0,
	center: 0,
	dither: 0,
	falloff: 0
}

const grid = new VizGrid(options)
```

All options are exposed as properties which are explained below. `grid.render()` needs to be called for property changes to take effect.

### `initial` property {object} _readonly_

The `initial` property stores the initial parameters specified when instantiating the grid and can be accessed. For instance if you want to access the `type` originally specified you could call `grid.initial.type`. This object cannot be set, but the `reset()` method below harnesses it (and is probably most useful).

### `type` {string}

>**NB** Not yet implemented, see issues.

Change the type of grid to polar by setting the `type` property of the options object to `'polar'`. **Default** is `'cartesian'`:

```
// option
type: 'polar'

// property
grid.type = 'catesian';
```

### `width` {int}

The width of the grid in pixels. **Default** `1200`.

```
// option
width: window.innerWidth

// property
grid.width = 1600;
```

### `height` {int}

The height of the grid in pixels. **Default** `800`.

```
// option
height: window.innerHeight

// property
grid.height = 200;
```

For a perfect square (cartesion) or perfect circle (polar) make the width & the height the same:

```
width: 600,
height: 600
```

> Neither height nor width take into account `pixelAspectRatio` which can be useful when working with canvas.

```
width: window.innerHeight*window.devicePixelRatio
```

### `gx` and `gy` {int}

This is where the top left corner of the grid is and allows you to shift the grid around.

Both integers, in pixels **Default** `0`.

```
// option
gx: 90, // grid starts 90 pixels from the left

// property
grid.gy = 260; // grid starts 260 pixels from the top
```

### `padding` {boolean}

Set to `true` it creates space around the grid edge. Good to use with full screen grids. **Default** is `false`.

```
padding: true
```

### `spacing` {float}

This sets the amount of space between each grid coordinate. It is a float value between 0-1: 0 is no spacing, 1 is the biggest. **Default** is `0.5`.

```
// option
spacing: 0.7 // larger

// property
grid.spacing: 0.2 // smaller
```

### `center` {float | array}

This sets where the center point of the grid is. A value between 0-1 is mapped across the each axis (left to right, top to bottom) to return the center coordinate. **Default** is 0 (top left);

Let's say the center is set to 0.75:

```
// as an option
center: 0.75
```

The center of the grid would be 75% across the width and 75% down the height.

The center can also be set with an array of two floats between 0-1. The first item is the x position and the second is the y position of the center coordinate:

```
// or as a property
grid.center = [0.1, 0.5];
```

`center` is set with a float, or an array of two floats. However, when it is read, an object with properties `x` and `y` is returned:

```
console.log(grid.center) // {x: 0.1, y: 0.5}
```

#### `dc` property of map items

This `center` sets the `dc` property of each map item (distance to center). This is an object with the properties `x` (how far from the horizontal center the coordinate is), `y` (how far from the vertical center the coordinate is) & `av` (the average of both previous values). Each property is represented by a float value from 0-1. 1 being closest to the center point, 0 being furthest away.

<!-- By default, the maximum distance is calculated by the distance between the center and the edge of the grid of where the coordinate is situated. -->

By default the maximum distance a coordinate can be away from the center is calculated by the longest measurement from the center to each side.

<!-- #### `centerKey` _readonly_

An added property `centerKey` is available. This returns an array of two values. This is equal to the key of the map coordinate which is closest to the center point. -->

### `dither` {float}

The `dither` option sets the `alive` property of each coordinate. It accepts a float value between 0 & 1, with the **default** being `0` (no dither).

If a value higher than `0` is used, each coordinate has a chance of 'dying' (`alive` set to `false`) the further away from the center point it gets.

The higher the value used, the more chance a coordinate's `alive` property is set to false.

```
// option
dither: 0.1 // slight dither

// property
grid.dither = 0.9; // lots of dither
```

### `falloff` {float}

`falloff` is set with a float between 0 & 1, **default** is `0`. `falloff` is tested when the `alive` property on each coordinate is set. At this time it works a little like a _cutoff_ rather than a smooth _falloff_: The higher the value the more coordinates are kept alive, working from the center outwards. It's works well with `dither` above to get some interesting effects.

```
// option
falloff: 0.1 // some coordinates close to the center will be kept alive

// property
grid.falloff = 0.5; // about half of coordinates close to the center will be kept alive
```

## Options & matching properties for a cartesian grid

### `axis` {string}

This sets the direction of the grid. **Default** is `'x'` and creates the grid left to right, top to bottom. Changing the axis to `'y'` creates the grid top to bottom, left to right.

This affects the `ratio` and `offset` properties. It also affects how the grid is calculated. If 'x' is the, axis the space between coordinates uses the grid `width`. If 'y' the grid `height`.

```
// option
axis: 'y'

// property
grid.axis = 'x';
```

### `ratio` {float}

This modifies the space between coordinates on one axis. It is a float value between 0 & 2. **Default** is `1`.

For a cartesian grid, perfect squares are generated with default settings. By setting the `ratio` value between 0 & 1, the `x` or width of each space is reduced. By setting it to a value between 1 & 2, the space in increased. This means you can create rectangles, or for isometric grids manipulate the triangles between points.

> **NB** The values effect the height if the `axis` is set to `y`. So a value between 0 & 1 reduces the height between coordinates and a value between 1 & 2 increases it.

```
// option
ratio: 0.5 // reduce space on one axis

// property
grid.ratio = 1.5 // increase ratio on one axis
```

### `offset` {float}

This moves every other line on the grid by the offset specified. Whether it's every other horizontal line or vertical line depends on the axis ('x' & 'y' retrospectively).

A float value between 0 & 1 where 0 is no offset and 1 is shift right/down by one line. `0.5` gives you a good isometric grid.

```
// option
offset: 0.5 // shift every other line by half distance between two coords

// property
grid.offset = 0.2 // shift every other line a small bit
```

## Options & matching properties for a polar grid

To conform options, settings for a polar grid use the same property name as a cartesian grid, however they do different things.

## Properties

#### `spacingConstant` {int}

The `spacingConstant` property allows further tweaking of size. It is initially set to `60` and higher values bring coordinates _closer_ together, whilst smaller values set them further apart.

The default `60` works well for average laptop fullscreen sizes, so a good property to adjust if screen size changes:

```
grid.spacingConstant = 80 // smaller screen
grid.spacingConstant = 40 // larger screen
```

### `cw` {int} _readonly_

This returns the calculated width of a 'cell' - basically the horizontal space between one point and the next.

```
const cellWidth = grid.cw;
```

Can only be read, but you can manipulate via `spacing`, `spacingConstant` and `ratio` properties.

### `ch` {int} _readonly_

This returns the calculated height of a 'cell' - the vertical space between one point and the next.

```
const cellHeight = grid.ch;
```

Can only be read, but you can manipulate via `spacing`, `spacingConstant` and `ratio` properties.

### `xCount` {int} _readonly_

Returns the total coordinates across one row of the horizontal grid.

```
const xCount = grid.xCount;
```

> Be careful when using with arrays, the first item is '1' not '0'

### `yCount` {int} _readonly_

Returns the total coordinates down one column of the vertical grid.

```
const yCount = grid.yCount;
```

> Be careful when using with arrays, the first item is '1' not '0'


> Worth nothing the two above properties are **not** affected by `axis`.

### `grid` {array}

It seems worthy to expose; this is created when the grid is generated and is used for the eventual map creation. It's a nested array of rows, columns and coordinates.

Let's take a look at VizGrid.grid:

```
Arr[
	Arr[
		{ x: 0, y: 0 }
	]
]
```

If the axis is set to `x` the first array loops over the rows of the grid, for each item in the nested array the rows are read left to right. So you can access the coordinates of the grid by `VizGrid.grid[5][3]` which will return the coordinate at the 5th row down and 3rd point across.

If the access is set to `y` this is reversed. `VizGrid.grid[5][3]` would return the coordinate at the 3rd row down and 5th point across.

> Whilst I personally don't use this property when working with VizGrid, I think it's worthy of exposure. There's lots of lovely things you can do with grids with basic for loops when they are nested arrays. Little drawn mazes, Conway's Game of Life... it's a nice thing to expose and if you're a beginning a pretty cool place to start.

## Methods

### `render()`

To re-generate the grid if any of the properties are changed, call the `render()` method:

```
grid.render();
```

### `reset(render = true)`

To reset the grid to it's original options when created, call the `reset()` method.

```
grid.reset();
```

An optional parameter can be specified for if you want the grid to re-render after it's reset. By default it _does_ but you can set to `false` in case you want to call `render()` later.

### `rShift(amount = 1)`

This randomly shifts each grid point for a more organic distribution.

```
grid.rShift(0.3);
```

It accepts a value between 0 & 1 describing how much you want to shift each point by. The maximum is cell width (`cw`) & cell height (`ch`).


# Need more?

Don't be scared to make multiple grids! 



