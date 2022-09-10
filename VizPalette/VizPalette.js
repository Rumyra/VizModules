import tinycolor from './tinyCol.js';

// console.log(tinycolor('red'));

// TODO add rotation for stripes & grid pattern?
// rotate the canvas
		// offCtx.translate(size/2, size/2);
		// offCtx.rotate(rotation);
		// offCtx.translate(-size/2, -size/2);
// TODO manipulate fills in palette class
// TODO recreate pattern when properties change
// we need to keep a copy of fills that have been created, so when properties or methods are used they can be recreated

/**
 * VizFill creates canvas pattern and gradient fills for use with VizPalette.
 * @param {Object} An options object with the following properties - all are optional
 * - `type` {String} The type of fill to create. Can be:
 * * - `'dots'` _default_: A `CanvasPattern` of dots.
 * * - `'dotgrid'`: A `CanvasPattern` a dot grid.
 * * - `'stripes'`: A stripey `CanvasPattern`.
 * * - `'grid'`: A line grid `CanvasPattern`.
 * * - `'checkered'`: A checkered `CanvasPattern`.
 * * - `'lgradient'`: A linear `CanvasGradient`.
 * - `fgCol` {CSSColor} The foreground colour of the pattern
 * - `bgCol` {CSSColor} The background colour of the pattern
 * - `size` {int} `24` The size of the repeating part of the pattern
 * - `ratio` {float} `1` Determines how big the pattern part is compared to the repeatable size above. E.g. for 'dots' increasing the ratio will increase the circle radius of the dot
 *
 * @returns {CanvasPattern | CanvasGradient} call VizFill.fill
 */
class VizFill {
	#type;
	#fgCol;
	#bgCol;
	#size;
	#ratio;
	#fill;
	#offScreenCanvas;
	#ctx;

	constructor({type = 'dots', fgCol = '#fefefe', bgCol = '#111', size = 24, ratio = 1} = {}) {
		this.#type = type;
		this.#fgCol = fgCol;
		this.#bgCol = bgCol;
		this.#size = size;
		this.#ratio = ratio;

		// create an offscreencanvas & context
		this.#offScreenCanvas = new OffscreenCanvas(this.#size, this.#size);
		this.#ctx = this.#offScreenCanvas.getContext('2d');

		this.#fill = this.render();
	}

	// getters & setters
	/**
	 * [sets & returns the type of fill]
	 * @return {String}
	 */
	get type() {
		return this.#type;
	}
	set type(type) {
		this.#type = type;
	}

	/**
	 * [Sets & returns the foreground colour]
	 * @return {CSSColor}
	 */
	get fgCol() {
		return this.#fgCol;
	}
	set fgCol(col) {
		this.#fgCol = col;
	}

	/**
	 * [Sets & returns the background colour]
	 * @return {CSSColor}
	 */
	get bgCol() {
		return this.#bgCol;
	}
	set bgCol(col) {
		this.#bgCol = col;
	}

	/**
	 * [Sets & returns the size of the repeatable part of the fill]
	 * @return {int}
	 */
	get size() {
		return this.#size;
	}
	set size(val) {
		this.#size = val;
	}

	/**
	 * [Sets and returns the ratio of the pattern]
	 * @return {float}
	 */
	get ratio() {
		return this.#ratio;
	}
	set ratio(val) {
		this.#ratio = val;
	}

	/**
	 * [fill description]
	 * @return {[type]} [description]
	 */
	get fill() {
		return this.#fill;
	}

	

	/**
	 * Runs the canvas drawing parts for each pattern
	 * @return {this}
	 */
	draw() {
		// switch options
		switch (this.#type) {
			case 'dotgrid':
				this.#ctx.arc(this.#size / 2, this.#size / 2, (this.#size / 6)*this.#ratio, 0, Math.PI*2);
				break;

			case 'stripes':
				// draw line
				this.#ctx.strokeStyle = this.#fgCol;
				this.#ctx.lineWidth = (this.#size/2)*this.#ratio;
				this.#ctx.moveTo(this.#size/2, 0-(this.#size/4));
				this.#ctx.lineTo(this.#size/2, this.#size+(this.#size/4));
				this.#ctx.stroke();
				break;

			case 'grid':
				this.#ctx.strokeStyle = this.#fgCol;
				this.#ctx.lineWidth = (this.#size/3)*this.#ratio;
				this.#ctx.moveTo(this.#size/2, 0-(this.#size/4));
				this.#ctx.lineTo(this.#size/2, this.#size+(this.#size/4));
				this.#ctx.moveTo(0-(this.#size/4), this.#size/2);
				this.#ctx.lineTo(this.#size+(this.#size/4), this.#size/2);
				this.#ctx.stroke();
				break;

			case 'checkered':
				this.#ctx.fillRect(0, 0, (this.#size/2)*this.#ratio, (this.#size/2)*this.#ratio);
				this.#ctx.fillRect(this.#size/2, this.#size/2, (this.#size/2)*this.#ratio, (this.#size/2)*this.#ratio);
				break;

			default: //dots
				const quart = this.#size/4;
				this.#ctx.arc(quart, quart, (this.#size/6)*this.#ratio, 0, Math.PI*2);
				this.#ctx.arc(this.#size-quart, this.#size-quart, (this.#size/6)*this.#ratio, 0, Math.PI*2);
				break;
			}
		return this;
	}

	/**
	 * Renders the pattern or gradient to an offscreencanvas
	 * @return {CanvasPattern | CanvasGradient}
	 */
	render() {
		// if type is gradient then return a canvas gradient
		if (this.#type === 'lgradient') {
			const gradient = this.#ctx.createLinearGradient(0, 0, this.#size, this.#size);
			gradient.addColorStop(0, this.#fgCol);
			gradient.addColorStop(1, this.#bgCol);
			this.#ctx.fillStyle = gradient;
			this.#ctx.fillRect(0, 0, this.#size, -this.#size);
			return gradient;
		} else {
			// return pattern
			this.#ctx.fillStyle = this.#bgCol;
			this.#ctx.fillRect(0, 0, this.#size, this.#size);
			this.#ctx.fillStyle = this.#fgCol;

			this.draw();

			this.#ctx.fill();

			return this.#ctx.createPattern(this.#offScreenCanvas, 'repeat');
		}
	} // render

} // ~~~~~~~~~~~~~~~~~~ VizFill

// =============================================

/**
 * VizPalette creates colour palettes from one colour or an array.
 * Takes an options object with the following:
 * - input can be one colour (in any css colour format) or an array of colours. If one colour is specified a palette is generated. Otherwise the array of colours becomes the palette
 * @param {Object} An options object with the following properties - all are optional
 * - `input` One colour, an array of colours, or if nothing is specified a random colour (and palette) is generated
 * - `paletteType` only takes affect if one colour is specified and determines the style of palette returned. Can be:
 * * - `'tetrad'` _default_: Six colours, one original, one very dark, one very light and three additional which are tetrad compliments of the input.
* * - `'same'`: Five colours, one original, one very dark, one very light and two additional similar to the input.
* * - `'split'` Five colours, one original, one very dark, one very light and two additional which are split compliments of the input.
* * - `'triad'` Five colours, one original, one very dark, one very light and two additional which are triad compliments of the input.
 * - `darkBg`: `bg` and `fg` properties are included as part of the returned array, this determines whether the background is dark and foreground is light (if set to `true`) and vice versa (if set to `false`)
 *
 * @returns {Array} An array of hex value strings
 */
class VizPalette extends Array {

	#input;
	#darkBg;
	#paletteType;
	#tinyColors; // mutable
	#origPalette; // immutable
	#fills;
	#luminance = 0;
	#saturation = 0;
	#spin = 0;
	#brightness = 0;

	constructor({
		input = `hsla(
			${Math.floor(Math.random()*360)},
			${Math.floor(Math.random()*70)+15}%,
			${Math.floor(Math.random()*60)+20}%,
		1)`,
		paletteType = 'tetrad',
		darkBg = true } = {}) {
		super();

		this.#input = input;
		this.#paletteType = paletteType;
		this.#darkBg = darkBg;
		this.#fills = [];

		this.#generateColours();
		this.#origPalette = this.#tinyColors;
		this.generatePalette();
	}

	// getters & setters ~~~~~~~~~~~~~~~~~~~
	/**
	 * One colour or an array of colours in any {CSSColor} format
	 * @return {String | Array}
	 */
	get input() {
		return this.#input;
	}
	set input(col) {
		this.#input = col;
		this.generatePalette();
	}

	/**
	 * If one colour is used as the input a palette type can be specified
	 * @return {String}
	 */
	get paletteType() {
		return this.#paletteType;
	}
	set paletteType(type) {
		this.#paletteType = type;
		this.generatePalette();
	}

	/**
	 * Set whether the background is dark (`true`) or light (`false`)
	 * @return {bool}
	 */
	get darkBg() {
		return this.#darkBg;
	}
	set darkBg(bool) {
		this.#darkBg = bool;
		this.generatePalette();
	}

	/**
	 * Finds the darkest colour in the palette
	 * @return {tinyColor}
	 */
	get #darkest() {
		return this.#findDarkest(this.#tinyColors);
	}

	/**
	 * Finds the lightest colour in the palette
	 * @return {tinyColor}
	 */
	get #lightest() {
		return this.#findLightest(this.#tinyColors);
	}

	/**
	 * Returns the background colour of the palette (depends on whether `darkBg` is set to `true` or `false`)
	 * @return {String} Hexadecimal string of the olour
	 */
	get bg() {
		if (this.#darkBg === true) {
			return this.#darkest.toHslString();
		} else {
			return this.#lightest.toHslString();
		}
	}
	/**
	 * Returns the foreground colour of the palette (depends on whether `darkBg` is set to `true` or `false`)
	 * @return {String} Hexadecimal string of the olour
	 */
	get fg() {
		if (this.#darkBg === false) {
			return this.#darkest.toHslString();
		} else {
			return this.#lightest.toHslString();
		}
	}

	/**
	 * [random returns a random colour from the palette]
	 * @return {string} HSLA string
	 */
	get random() {
		const rInt = Math.floor(Math.random()*this.length);
		return this.#tinyColors[rInt].toHslString();
	}

	// METHODS
	// palette modifiers ----------------

	/**
	 * [luminance increases and decreases the lightness of the palette]
	 * @param  {float} amount Value between -1 & 1
	 * @return {float}
	 */
	luminate(amount) {
		// luminance gets added so we only want to add the difference
		const dif = amount - this.#luminance;
		this.#tinyColors.forEach( col => {
			if (dif > 0) {
				col.lighten(dif*100)
			} else {
				col.darken(dif*-100)
			}
		})
		this.generatePalette();
		this.#luminance = amount;
		return this;
	}
	
	/**
	 * [saturation increases and decreases the saturation of the palette]
	 * @param  {float} amount Value between -1 & 1
	 * @return {this}
	 */
	saturate(amount) {
		// saturation gets added so we only want to add the difference
		const dif = amount - this.#saturation;
		this.#tinyColors.forEach( col => {
			if (dif > 0) {
				col.saturate(dif*100)
			} else {
				col.desaturate(dif*-100)
			}
		})
		this.generatePalette();
		this.#saturation = amount;
		return this;
	}
	
	/**
	 * [spin rotates the hue of the palette]
	 * @param  {float} amount Value between -1 & 1
	 * @return {this}
	 */
	spin(amount) {
		const dif = amount - this.#spin;
		this.#tinyColors.forEach( col => {
			col.spin(dif*360)
		})
		this.generatePalette();
		this.#spin = amount;
		return this;
	}

	/**
	 * [setAlpha sets the alpha value of colours]
	 * @param {float} amount Value between 0 & 1
	 */
	setAlpha(amount) {
		this.#tinyColors.forEach( col => {
			col.setAlpha(amount)
		})
		this.generatePalette();
		return this;
	}

	brighten(amount) {
		const dif = amount - this.#brightness;
		this.#tinyColors.forEach( col => {
				col.brighten(dif*100)
		})
		this.generatePalette();
		this.#brightness = amount;
		return this;
	}

	/**
	 * Generates the colour palette and sets the #tinycolors property
	 * @return {this}
	 */
	#generateColours() {
		this.#tinyColors = [];

		// Check if input is array
		if (Array.isArray(this.#input)) {
			// push into tiny colors array as tinycolor
			this.#input.forEach( el => {
				this.#tinyColors.push(tinycolor(el))
			} )
			// sort #tinyColors so bg is first and fg is second
			const fgi = this.#tinyColors.findIndex(el => el.toHslString() === this.fg);
			const fgel = this.#tinyColors.splice(fgi, 1)[0];
			this.#tinyColors.splice(0, 0, fgel);

			const bgi = this.#tinyColors.findIndex(el => el.toHslString() === this.bg);
			const bgel = this.#tinyColors.splice(bgi, 1)[0];
			this.#tinyColors.splice(0, 0, bgel);

		} else {

			// set up light/dark
			const mono = tinycolor(this.#input).monochromatic(5);
			
			// get a dark colour
			let dark = this.#findDarkest(mono);

			// get a light colour
			let light = this.#findLightest(mono);
			light.lighten(24);

			// switch options
			switch (this.#paletteType) {
				case 'same':

					// let's get a range of colours of similar hues
					const sameCols = tinycolor(this.#input).analogous(10);
					// remove input col
					sameCols.shift();
					// find the darkest
					const sameDark = this.#findDarkest(sameCols);
					// find the lightest
					const sameLight = this.#findLightest(sameCols);
					// push into an array of three
					this.#tinyColors.push(tinycolor(this.#input), sameLight, sameDark);
					break;

				case 'split':
					this.#tinyColors = tinycolor(this.#input).splitcomplement();
					break;

				case 'triad':
					this.#tinyColors = tinycolor(this.#input).triad();
					break;

				default:
					this.#tinyColors = tinycolor(this.#input).tetrad();
					break;
			}


			// add light & dark
			if (this.#darkBg === true) {
				this.#tinyColors.unshift(light);
				this.#tinyColors.unshift(dark);
			} else {
				this.#tinyColors.unshift(dark);
				this.#tinyColors.unshift(light);
			}
		}
		return this;
	} // #generateColours

	/**
	 * Adds a VizFill to the palette
	 * @param {Object} opts See VizFill for options
	 */
	addFill(opts) {
		const pattern = new VizFill(opts);
		this.push(pattern.fill);
		return pattern;
	}

	
	/**
	 * Loops over #tinyColors and returns hexadecimal strings
	 * @return {Array} Returns the generated VizPalette
	 */
	generatePalette() {
		this.length = 0;
		// add colours
		this.#tinyColors.forEach( col => {
			this.push(col.toHslString())
		} )
	}

	reset() {
		this.#tinyColors = this.#origPalette;
	}

	// UTILITIES

	/**
	 * [findDarkest Returns the darkest colour from an array of tinycolors]
	 * @param  {[Array]} arr of tinycolors
	 * @return {[tinycolor]} returns tinycolor of darkest color
	 */
	#findDarkest(arr) {
		let dark = arr[0];
		arr.forEach( col => {
			if (col.getBrightness() < dark.getBrightness()) {
				dark = col;
			}
		});
		return dark;
	}

	/**
	 * [findLightest Returns the lightest colour from an array of tinycolors]
	 * @param  {[Array]} arr of tinycolors
	 * @return {[tinycolor]} returns tinycolor of lightest color
	 */
	#findLightest(arr) {
		let light = arr[0];
		arr.forEach( col => {
			if (col.getBrightness() > light.getBrightness()) {
				light = col;
			}
		});
		return light;
	}

}

export default VizPalette;