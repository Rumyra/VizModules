// Coded by @Rumyra | https://rumyra.com
// 
// maybe return the context in the constructor so you don't have to do `canvas.ctx.draw`... context could be extended in draw stuff - but should this extend the canvas element?? Write up some nice methods & then decide

// takes an input value between inMin & inMax and returns an output mapped to outMin & outMax
function mapRange(number, inMin, inMax, outMin, outMax) {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
// clamp val between -1 & 1
function filterClamp(val) {
	return val < -1
	? (-1)
	: (val > 1 ? 1 : val);
}

class VizCanvas {

	#canvas = document.createElement('canvas');
	#wrapper = document.createElement('div');
	#ctx;
	#bgCol;
	#brightness = 0;
	#contrast = 0;
	#sepia = 0;
	#saturation = 0;
	#hueRotate = 0;
	#blur = 0;
	#invert = 0;

	constructor({bgCol = '#111'} = {}) {

		this.#bgCol = bgCol;
		this.#createCanvas();

		window.addEventListener('resize', () => {
			this.canvas.width = this.width;
			this.canvas.height = this.height;
		})

	}

	// getters & setters ++++++++++++++++++

	/**
	 * canvas: the canvas element
	 * @return {domnode} Returns the canvas element.
	 */
	get canvas() {
		return this.#canvas;
	}

	/**
	 * wrapper: the div element around the canvas element.
	 * @return {domnode} Returns the div element.
	 */
	get wrapper() {
		return this.#wrapper;
	}

	/**
	 * ctx: The canvas drawing context - this is 2d
	 * @return {context} Returns the canvas 2d drawing context.
	 */
	get ctx() {
		return this.#ctx;
	}

	/**
	 * dpr: Device pixel ratio
	 * @return {float} Returns the device pixel ratio
	 */
	get dpr() {
		return window.devicePixelRatio;
	}

	/**
	 * width: the width of the canvas
	 * @return {int} Returns the width of the canvas in pixels - takes into account devicePixelRatio
	 */
	get width() {
		return window.innerWidth*this.dpr;
	}

	/**
	 * height: the height of the canvas
	 * @return {int} Returns the height of the canvas in pixels - takes into account devicePixelRatio
	 */
	get height() {
		return window.innerHeight*this.dpr;
	}

	/**
	 * cx: horizontal center of the canvas
	 * @return {int} Returns the horizontal center point of the canvas in pixels
	 */
	get cx() {
		return Math.floor(this.width/2);
	}

	/**
	 * cy: vertical center of the canvas
	 * @return {int} Returns the vertical center point of the canvas in pixels
	 */
	get cy() {
		return Math.floor(this.height/2);
	}

	/**
	 * bgCol Sets the background colour of the canvas - only takes affect when `clear()` is called
	 * @return {string} Returns the background colour of the canvas
	 */
	get bgCol() {
		return this.#bgCol;
	}
	set bgCol(col = '#111') {
		this.#bgCol = col;
		this.clear(col);
	}

	// filters +++++++++++++++++
	get brightness() {
		return this.#brightness;
	}
	set brightness(val) {
		this.#brightness = filterClamp(val);
		this.#setFilters();
	}

	get contrast() {
		return this.#contrast;
	}
	set contrast(val) {
		this.#contrast = filterClamp(val);
		this.#setFilters();
	}

	get sepia() {
		return this.#sepia;
	}
	set sepia(val) {
		this.#sepia = val < 0 ? 0 : filterClamp(val);
		this.#setFilters();
	}

	get saturation() {
		return this.#saturation;
	}
	set saturation(val) {
		this.#saturation = filterClamp(val);
		this.#setFilters();
	}

	get hueRotate() {
		return this.#hueRotate;
	}
	set hueRotate(val) {
		this.#hueRotate = filterClamp(val);
		this.#setFilters();
	}
	
	get blur() {
		return this.#blur;
	}
	set blur(val) {
		this.#blur = val < 0 ? 0 : filterClamp(val);
		this.#setFilters();
	}

	get invert() {
		return this.#invert;
	}
	set invert(val) {
		this.#invert = val < 0 ? 0 : filterClamp(val);
		this.#setFilters();
	}

	

	// methods ++++++++++++++++++++++++

	/**
	 * createCanvas Adds the canvas element to the DOM & adds some styling to outer div (wrapper) and body so everything fits fullscreen
	 * @return {[type]} [description]
	 * @private
	 */
	#createCanvas() {
		// get body to append to and remove margin & padding
		const bodyEl = document.querySelector('body');
		bodyEl.style.padding = bodyEl.style.margin = '0px';

		// style wrapper
		this.#wrapper.style.width = '100vw';
		this.#wrapper.style.height = '100vh';
		this.#wrapper.style.backgroundColor = this.#bgCol;

		// style canvas
		this.canvas.style.width = '100%';
		this.canvas.style.height = '100%';
		this.#setFilters();

		// add to dom
		this.#wrapper.appendChild(this.canvas);
		bodyEl.appendChild(this.#wrapper);

		// set up canvas
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		// create context
		this.#createContext();
		// add background
		this.clear();
	}

	/**
	 * setFilters Creates the css style based on properties & applies to canvas element
	 * @private
	 */
	#setFilters() {
		// brightness val
		const brightVal = this.#brightness < 0 ?
			mapRange(this.#brightness, -1, 0, 0, 1) :
			mapRange(this.#brightness, 0, 1, 1, 18);
		// contrast val
		const conVal = this.#contrast < 0 ?
			mapRange(this.#contrast, -1, 0, 0, 1) :
			mapRange(this.#contrast, 0, 1, 1, 2);
		// saturation val
		const satVal = this.#saturation < 0 ?
			mapRange(this.#saturation, -1, 0, 0, 1) :
			mapRange(this.#saturation, 0, 1, 1, 18);

		// blur val
		const blurPx = mapRange(this.#blur, 0, 1, 0, 150);

		const filterStyle = `
			brightness(${brightVal}) 
			contrast(${conVal}) 
			sepia(${this.#sepia})
			saturate(${satVal}) 
			hue-rotate(${this.#hueRotate}turn) 
			blur(${blurPx}px) 
			invert(${this.#invert}) 
		`;

			this.canvas.style.filter = filterStyle;
	}

	/**
	 * createContext Sets up the 2d rendering context with my regular options
	 * @return {[type]} [description]
	 * @private
	 */
	#createContext() {
		this.#ctx = this.#canvas.getContext('2d');
		this.#ctx.imageSmoothingQuality = 'high';
		this.#ctx.lineCap = 'round';
		this.#ctx.lineJoin = 'round';
		this.#ctx.lineWidth = 3.0;
	}

	clear(bgCol = '#111') {

		if (arguments.length>0) {
			this.#bgCol = bgCol;
		}

		this.#wrapper.style.backgroundColor = this.#bgCol;
		this.ctx.clearRect(0,0, this.width, this.height);
		this.ctx.fillStyle = this.#bgCol;
		this.ctx.fillRect(0,0, this.width, this.height);

		return this;
	}


} // VizCanvas


export default VizCanvas;

// FILE & DATA STUFF
// /**
// * dataURL
// * @param {string} [png/jpg/webp] image type
// * @param {number} [0.92] quality
// * @description Returns a data url of whatever is on the canvas
// * @returns data url
// */
// 	dataURL(type = 'png', quality = 0.92) {
// 		return this.canvas.toDataURL();
// 	}
// *
// * createFile
// * @param {string} [png/jpg/webp] image type
// * @param {number} [0.92] quality
// * @description Creates a link and adds to the DOM which allows image download of whatever is on canvas
// * @return this
// * @todo style the button and position it

// 	createFile(type = 'png', quality = 0.92) {
// 		const callback = function (blob) {
// 			const url = window.URL.createObjectURL(blob);
// 			const link = document.createElement("a");
// 			link.href = url;
// 			link.innerText = 'canvas image';
// 			link.download = 'download';
// 			document.querySelector('body').append(link);
// 		}

// 		const data = this.canvas.toBlob(callback, type, quality);

// 		return this;
// 	}


