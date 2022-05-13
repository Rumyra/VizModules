import tinycolor from './tinyCol.js';

console.log(tinycolor('red'));

// TODO add rotation for stripes & grid pattern?
// rotate the canvas
		// offCtx.translate(size/2, size/2);
		// offCtx.rotate(rotation);
		// offCtx.translate(-size/2, -size/2);
// TODO manipulate fills in palette class

// Canvas Fill class for use in palette
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
	// TODO redraw on change
	get type() {
		return this.#type;
	}
	set type(type) {
		this.#type = type;
	}

	get fgCol() {
		return this.#fgCol;
	}
	set fgCol(col) {
		this.#fgCol = col;
	}

	get bgCol() {
		return this.#bgCol;
	}
	set bgCol(col) {
		this.#bgCol = col;
	}

	get size() {
		return this.#size;
	}
	set size(val) {
		this.#size = val;
	}

	get ratio() {
		return this.#ratio;
	}
	set ratio(val) {
		this.#ratio = val;
	}

	get fill() {
		return this.#fill;
	}

	

	// contains just the drawing part patterns
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

	}


	// draws pattern
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


} // VizFill

/**
 * VizPalette creates colour palettes from one colour or an array.
 * Takes an options object with the following:
 * - input can be one colour (in any css colour format) or an array of colours. If one colour is specified a palette is generated. Otherwise the array of colours becomes the palette
 * @param {Object} An options object with the following properties - all are optional
 * - `input` One colour, an array of colours, or if nothing is specified a random colour (and palette) is generated
 * - `paletteType` only takes affect if one colour is specified and determines the style of palette returned
 * - `darkBg` a `bg` and `fg` property is included as part of the returned array, this determines whether the background is dark and foregraound is light (if set to `true`) and vixe versa (if set to `false`)
 *
 * @returns {Array} An array of hex value strings
 */
class VizPalette extends Array {

	#input;
	#darkBg;
	#paletteType;
	#tinyColors;

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

		this.#tinyColors = [];
		this.#generateColours();
		this.generatePalette();
	}

	// getters & setters ~~~~~~~~~~~~~~~~~~~
	
	get input() {
		return this.#input;
	}
	set input(col) {
		this.#input = col;
		this.generatePalette();
	}

	get paletteType() {
		return this.#paletteType;
	}
	set paletteType(type) {
		this.#paletteType = type;
		this.generatePalette();
	}

	get #darkest() {
		return this.#findDarkest(this.#tinyColors);
	}

	get #lightest() {
		return this.#findLightest(this.#tinyColors);
	}

	get bg() {
		if (this.#darkBg === true) {
			return this.#darkest.toHexString();
		} else {
			return this.#lightest.toHexString();
		}
	}

	get fg() {
		if (this.#darkBg === false) {
			return this.#darkest.toHexString();
		} else {
			return this.#lightest.toHexString();
		}
	}

	/**
	 * [generateColours description]
	 * @return {Array} Returns an array of tinycolors based on input
	 * TODO set this to a property
	 */
	#generateColours() {
		let colArr = [];

		// Check if input is array
		if (Array.isArray(this.#input)) {
			// push into tiny colors array as tinycolor
			this.#input.forEach( el => {
				this.#tinyColors.push(tinycolor(el))
			} )
			// sort #tinyColors so bg is first and fg is second
			const fgi = this.#tinyColors.findIndex(el => el.toHexString() === this.fg);
			const fgel = this.#tinyColors.splice(fgi, 1)[0];
			this.#tinyColors.splice(0, 0, fgel);

			const bgi = this.#tinyColors.findIndex(el => el.toHexString() === this.bg);
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

	}

	addPattern(opts) {
		const pattern = new VizFill(opts);
		this.push(pattern.fill);
		return pattern;
	}

	generatePalette() {
		// add colours
		this.#tinyColors.forEach( col => {
			this.push(col.toHexString())
		} )
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