// coded by @Rumyra https://rumyra.com

/**
 * VizFill Class which returns CanvasGradient or CanvasPattern with mutable properties
 *
 * options are the following:
 * `fgCol` {csscolor} foreground colour
 * `bgCol` {csscolor} background colour
 * `size` {int} size of pattern
 * `lineWidth` {float} line width of pattern
 * `rotation` {radian} how much the pattern rotates
 * `gradient` {boolean} set to false meaning a CanvasPattern is returned. If set to true a CanvasLinearGradient is returned
 */
class VizFill {
	#fgCol;
	#bgCol;
	#size;
	#lineWidth:
	#rotation;
	#gradient = false;


	constructor({fgCol = '#eee', bgCol = '#111', size = 24, lineWidth = 4.0, rotation = 0, gradient = false} = {}) {
		this.#fgCol = fgCol;
		this.#bgCol = bgCol;
		this.#size = size;
		this.#lineWidth = lineWidth;
		this.#rotation = rotation;
		this.#gradient = gradient;
	}

	// getters & setters
	get fgCol {
		return this.#fgCol;
	}
	set fgCol(col) {
		this.#fgCol = col;
	}

	get bgCol {
		return this.#bgCol;
	}
	set bgCol(col) {
		this.#bgCol = col;
	}

	get size {
		return this.#size;
	}
	set size(val) {
		this.#size = val;
	}

	get lineWidth {
		return this.#lineWidth;
	}
	set lineWidth(val) {
		this.#lineWidth = val;
	}

	get rotation {
		return this.#rotation;
	}
	set rotation(rad) {
		this.#rotation = rad;
	}

	get gradient {
		return this.#gradient;
	}
	set gradient(bool) {
		this.#gradient = bool;
	}
	
	// methods
	render() {
		// create offscreen canvas
		const offCan = new OffscreenCanvas(this.#size, this.#size);
		const offCtx = offCan.getContext('2d');
		this.draw()
		
	}

}

export default VizFill;