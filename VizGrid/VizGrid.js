// Created & coded by @Rumyra: https://rumyra.com

// functions for use in class
function clamp(value, min, max) {
	return min < max
  ? (value < min ? min : value > max ? max : value)
  : (value < max ? max : value > min ? min : value);
}

// interpolates value x - used throughout for 0-1 vals. 0.1 is smaller and 0.9 is bigger, if invert is set to true 0.1 is larger and 0.9 is smaller
function smoothstep(x, inv = false) {
	const y = x * x * (3 - (2 * x));
	return inv ? x + (x - y) : y;
}

function chance(chance) {
	const test = Math.random();
	return test < chance ? true : false;
}

// TODO add test for an object
function parseValToXY(val) {
	// if val is array, split up items and return x & y
	if (Array.isArray(val)) {
		return {
			x: val[0],
			y: val[1]
		}
	} else {
		return {
			x: val,
			y: val
		}
	}
}

/**
 * @param {object} options
 * @description includes:
 * type {string}: The type of grid to return. This can be 'cartesian' or 'polar'. Default is 'cartesian'.
 * width {int}: width of the grid in pixels. Default is 1200.
 * height [int}: height of the grid in pixels. Default is 800
 * gx {int}: horizontal start point in pixels. Default is 0.
 * gy {int}: vertical start point in pixels. Default is 0.
 * padding {boolean}: whether there is space around the outer edge of the grid. Default is false.
 * spacing {float} between 0-1: How much space between coordinates. Default is 0.5.
 * ratio {float} between 0-2: Modifies the space between coordinates on whatever axis is set.
 * axis {string} 'x' or 'y': Which direction coords are generated. Changes how offset and ratio are applied.
 * offset {float} 0-1: how much to offset every other line.
 * center {float | array} One or two (array) float values, between 0-1, to set where the 'center' of the grid is.
 * dither {boolean} true mean the `alive` property for each item will be set based on how far away the coordinate is from the center point
 * falloff {float}: Float value between 0-1. How slowly coordinates 'die' (`alive` set to false) from the center point. 0 coords don't sie, 1 coords always die.
 */

class VizGrid extends Map {
	#type;
	#width;
	#height;
	#gx;
	#gy;
	#padding;
	#axis;
	#spacing;
	#spacingConstant = 60;
	#initSize = 100;
	#ratio;
	#offset;
	#center;
	#dither;
	#falloff;

	constructor({
		type = 'cartesian',
		width = 1200, height = 800, gx = 0, gy = 0,
		padding = false, axis = 'x',
		spacing = 0.5, ratio = 1, offset = 0,
		center = 0, dither = false, falloff = 0.5
	} = {}) {

		// get map things
		super();

		// keep original params
		this.initial = {};

		this.#type = this.initial.type = type;
		this.#width = this.initial.width = width;
		this.#height = this.initial.height = height;
		this.#gx = this.initial.gx = gx;
		this.#gy = this.initial.gy = gy;
		this.#padding = this.initial.padding = padding;
		this.#axis = this.initial.axis = axis;
		this.#spacing = this.initial.spacing = clamp(spacing, 0, 1);
		this.#ratio = this.initial.ratio = clamp(ratio, 0.01, 2);
		this.#center = this.initial.center = parseValToXY(center);
		this.#dither = this.initial.dither = dither;
		this.#falloff = this.initial.falloff = falloff;

		// these things need to happen in order
		// for use later if calculating cell width & height
		this.#initSize = this.#calculateSize();
		this.#offset = this.initial.offset = this.#calculateOffset(clamp(offset, 0, 1));

		this.render();

	}

	// GETTERS & SETTERS ==========================
	// TODO THESE ALL NEED TYPE TESTS
	
	/**
	 * @property {string} The type of grid
	 * @description Set the type of grid
	 * @param {string} 'cartesian' or 'polar'
	 * @returns {string}
	 */
	get type() { return this.#type; }
	set type(val) { this.#type = val; }

	/**
	 * @property {int} The width of the grid
	 * @description Set width of grid
	 * @param {int} Pixel value
	 * @returns {int}
	 */
	get width() { return this.#width; }
	set width(val) { this.#width = val; }

	/**
	 * @property {int} The height of the grid
	 * @description Set height of grid
	 * @param {int} Pixel value
	 * @returns {int}
	 */
	get height() { return this.#height; }
	set height(val) { this.#height = val; }

	/**
	 * @property {int} The horizontal position of the grid
	 * @description Set horizontal position of grid
	 * @param {int} Pixel value
	 * @returns {int}
	 */
	get gx() { return this.#gx; }
	set gx(val) { this.#gx = val; }

	/**
	 * @property {int} The vertical position of the grid
	 * @description Set vertical position of grid
	 * @param {int} Pixel value
	 * @returns {int}
	 */
	get gy() { return this.#gy; }
	set gy(val) { this.#gy = val; }

	/**
	 * @property {boolean} Whether there is space around the outer of the grid.
	 * @description Set padding around the grid.
	 * @param {boolean} Padding on/off.
	 * @returns {int}
	 */
	get padding() { return this.#padding; }
	set padding(val) { this.#padding = val; }

	/**
	 * @property {string} Which direction the grid is generated in
	 * @description Set axis direction
	 * @param {string} 'x' or 'y' direction.
	 * @returns {string}
	 */
	get axis() { return this.#axis; }
	set axis(direction) { this.#axis = direction; }

	/**
	 * @property {float} Spacing between coords
	 * @description Set how much spacing between grid coords
	 * @param {float} value between 0-1
	 * @returns {float}
	 */
	get spacing() {
		return this.#spacing;
	}
	set spacing(val) {
		this.#spacing = clamp(val, 0, 1);
	}

	/**
	 * @description Spacing constant: Spacing by and large is controlled by the spacing option/property. This works for most general screens, however a constant is also exposed for more control. By default it's 80, more will work better with bigger screens, less for smaller ones..
	 * @param {int}
	 */
	get spacingConstant() {
		return this.#spacingConstant;
	}
	set spacingConstant(val = 80) {
		this.#spacingConstant = val;
	}

	/**
	 * @property {float} Ratio 
	 * @description Modify the space between coords for one axis
	 * @param {float} value between 0 & 2
	 * @returns {float}
	 */
	get ratio() { return this.#ratio; }
	set ratio(val) { this.#ratio = clamp(val, 0.01, 2); }

	/**
	 * @description Set offset. Moves every other row or column based on value.
	 * @param {float} Offset can be set with a value between 0 and 1. 0 being no offset and 1 begin the cell size. Whether cell width or height is used depends on axis.
	 */
	get offset() { return this.#offset; }
	set offset(val) { 
		this.#offset = this.#calculateOffset(clamp(val, 0, 1));
	}

	/**
	 * @description Set center
	 * @param {float | array} Center can be set with a value between 0 and 1. Mapped across the each axis (left to right, top to bottom) to return the center coordinate. The keys of the returned map are modified. Can be an array of two floats between 0-1, the first item is the x center, the second is the y.
	 * @returns {object} With x & y properties.
	 */
	get center() { return this.#center; }
	set center(val) { 
		this.#center = parseValToXY(val);
	}

	/**
	 * @property {boolean} Whether coordinates are set to die the further they are from the center.
	 * @description Whether coordinates are set to die the further they are from the center..
	 * @param {boolean} dither on/off.
	 * @returns {boolean}
	 */
	get dither() { return this.#dither; }
	set dither(val) { this.#dither = val; }

	/**
	 * @description Set falloff - how quickly dither disappears (0) or stays (1)
	 * @param {float | array} amount A value between 0 (quick) and 1 (slow)
	 */
	get falloff() { return this.#falloff; }
	set falloff(amount) {
		this.#falloff = amount;
	}


	// SIZE CALCULATION & AXIS COUNTS
	/**
	 * @description return an initial cell size based on width, height, spacing & spacing constant. Uses width when axis is 'x' and height when axis is 'y'
	 * @returns {int}
	 * @private
	 */
	#calculateSize() {
		if (this.#axis === 'x') {
			return (this.#width) /
				(this.#spacingConstant *
				// Math.pow( 1-this.#spacing, 2));
				(1-smoothstep(this.#spacing))
				);
		} else if (this.#axis === 'y') {
			return (this.#height) /
				(this.#spacingConstant *
				// Math.pow( 1-this.#spacing, 2));
				(1-smoothstep(this.#spacing))
				);
		} else {
			console.error("axis needs to be 'x' or 'y'");
		}
	}

	/**
	 * @description Return cell width
	 * @returns {float}
	 * @readOnly
	 */
	get cw() {
		// ratio only if axis is x
		if (this.#axis === 'x') {

			// multiply cell size by ratio
			return this.#initSize * this.#ratio;

		} else {
			return this.#initSize;
		}
	} // cw()

	/**
	 * @description Return cell height
	 * @returns {float}
	 * @readOnly
	 */
	get ch() {
		// ratio only if axis is y
		if (this.#axis === 'y') {

			// multiply cell size by ratio
			return this.#initSize * this.#ratio;

		} else {
			return this.#initSize;
		}
	} // ch()

	/**
	 * Calculates the offset in pixels 
	 * @param  {float} val Value between 0 & 1
	 * @return {int} returns pixel value
	 */
	#calculateOffset(val) {
		if (this.axis === 'x') {
			return this.cw*val;
		} else {
			return this.ch*val;
		}
	}

	/**
	 * [xCount returns the total coordinates across the x axis]
	 * @return {[int]} [total horizontal coordinates in one row]
	 */
	get xCount() {
		// if x axis, total x will length of nested arr
		if (this.axis === 'x') {
			return this.grid[0].length;
		} else {
			return this.grid.length;
		}
	}

	/**
	 * [yCount returns the total coordinates down the y axis]
	 * @return {[int]} [total vertical coordinates in one column]
	 */
	get yCount() {
		// if x axis, total x will length of grid arr
		if (this.axis === 'x') {
			return this.grid.length;
		} else {
			return this.grid[0].length;
		}
	}
	

	// GRID GENERATION =========================
	// CARTESIAN ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	/**
	 * @description make a two dimensional array of objects with x and y points based on sizing. Includes padding & offset, but not distribution, which is achieved later. Nesting is based on axis: x is default so rows (y coord) are nested array & cols (x coord) is the value
	 * @returns {this} populates this.grid with a 2d array
	 */
	#generateCartGrid() {

		// loop starts
		let xStart = this.#gx;
		let yStart = this.#gy;

		// loop increments
		let xInc = this.cw;
		let yInc = this.ch;

		// loop ends -> adding a pixels so grid fills
		// TODO figure this out
		let xEnd = this.#width+1;
		let yEnd = this.#height+1;

		if (this.#padding === true) {
			xStart = xStart + this.cw;
			yStart = yStart + this.ch;
			xEnd = xEnd-this.cw;
			yEnd = yEnd-this.ch
		}

		const coords = [];
		// loop changes depending on axis - for 'x'
		if (this.#axis === 'x') {

			// need a flag for offset
			let isOffset = false;

			// loop over y increments
			for (let y = yStart; y <= yEnd; y += yInc) {
				const row = []; // row array

				// loop over x increments
				for (let x = xStart; x <= xEnd; x += xInc) {
					// copy for offset
					let dx = x;
					// test for if row is offset
					if (isOffset) {dx = dx+this.offset;}
					row.push({x: dx, y: y});
				}
				coords.push(row);
				isOffset = isOffset ? false : true;
			}
		// for 'y'
		} else {
			// offset flag
			let isOffset = false;
			for (let x = xStart; x <= xEnd; x += xInc) {
				const col = [];
				for (let y = yStart; y <= yEnd; y += yInc) {
					// copy for offset
					let dy = y;
					// test for if col is offset
					if (isOffset) {dy = dy+this.offset;}
					col.push({x: x, y: dy});
				}
				coords.push(col);
				isOffset = isOffset ? false : true;
			}
		}
		this.grid = coords;
		return this;
	}

	// DISTANCE FROM CENTER & ALIVE CHANCE
	/**
	 * [distanceAway calculates how far away a coordinate is from the center]
	 * @param {x} The x coordinate to test
	 * @param {y} The y coordinate to test
	 * @return {[object]} With the following properties
	 * x: 0-1 float how far away point is from center (1 is close, 0 is far)
	 * y: 0-1 float how far away point is from center (1 is close, 0 is far)
	 * av: Average of x & y values
	 */
	#distanceFromCenter(x, y) {

		// calculate x center pixel
		const CX = this.#width*this.#center.x;
		// calculate y center pixel
		const CY = this.#height*this.#center.y;

		// work out our distances - for the first pass this is based on the longest distance from the center to an edge.
		const MAXDIS = Math.max(
			CX,
			this.#width-CX,
			CY,
			this.#height-CY
		);

		// (MAXDIS - val)/MAXDIS - val is key here, if point is greater than center; point-center, if center is greater than point; center-point
		const xDis = x>CX ? (MAXDIS-(x-CX))/MAXDIS : (MAXDIS-(CX-x))/MAXDIS;
		const yDis = y>CY ? (MAXDIS-(y-CY))/MAXDIS : (MAXDIS-(CY-y))/MAXDIS;
		const avDis = (xDis+yDis) / 2

		// create distance from center
		return {x: xDis, y: yDis, av: avDis};
	}

	/**
	 * [generateCoords Turn the grid array into a map of coords]
	 * @return {[type]} [description]
	 */
	#generateCoords() {

		// clear map
		this.clear();

		// add coords
		this.grid.forEach((arr, dy) => {

			arr.forEach((coord, dx) => {
				
				// distance from center
				const dc = this.#distanceFromCenter(coord.x, coord.y);

				// alive? Based on average of how far away a coordinate is & dither
				// 0 is dead
				// 1 is alive
				// can test dither for 0 which would be alive
				// if dc is 0.1 (far away) and dither is a lot (0.9) very high chance of dead
				// dither is the opposite of distance, in that 1 is close and 1 is all dither (hence 1-)
				const aliveChance = smoothstep(
					(
						(1-this.#dither)
						+ dc.av
					) / 2
				)
				let alive = true;
				// only work if dither is higher than 0 (no dither), falloff is larger than distance, but again is opposite: 1 is close and 1 is no falloff (hence 1-)
				if ( (this.#dither>0) && ( dc.av<(1-smoothstep(this.#falloff, true)) ) ) {
					alive = chance(smoothstep(aliveChance));
				}

				this.set([dx, dy], {
					x: coord.x, y: coord.y,
					dc: dc,
					alive: alive
				})
			})
		})
	}

	/**
	 * @description Regenerate grid if any params change
	 */
	render() {
		this.#initSize = this.#calculateSize();
		this.#generateCartGrid();
		this.#generateCoords();
	}

	/**
	 * [reset Resets the grid to the original options parsed on instantiation]
	 * @param  {Boolean} render [Default true means the grid will also re-render. False means it does not, the properties are just changed & render() would need to be called to see the changes]
	 * @return {[type]}         [description]
	 */
	reset(render = true) {
		this.#type = this.initial.type;
		this.#width = this.initial.width;
		this.#height = this.initial.height;
		this.#gx = this.initial.gx;
		this.#gy = this.initial.gy;
		this.#padding = this.initial.padding;
		this.#axis = this.initial.axis;
		this.#spacing = this.initial.spacing;
		this.#ratio = this.initial.ratio;
		this.#center = this.initial.center;
		this.#dither = this.initial.dither;
		this.#falloff = this.initial.falloff;

		// these things need to happen in order
		this.#initSize = this.#calculateSize();
		this.#offset = this.initial.offset;

		if (render === true) {
			this.grid = [];
			this.render()
		}
	} // reset

	rShift(amount = 1) {
		// manipulate the grid array
		this.grid.forEach( arr => {
			arr.forEach( coord => {
				// x
				let rx = Math.random()*this.cw*amount;
				rx = chance(0.5) ? rx*-1 : rx;
				coord.x = coord.x + rx;

				// y
				let ry = Math.random()*this.ch*amount;
				ry = chance(0.5) ? ry*-1 : ry;
				coord.y = coord.y + ry;
			} );
		} );
		// then regenerate coords
		this.#generateCoords();
	}

}

export default VizGrid;
