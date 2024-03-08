// Get shapes in
// Write up docs
// Add scale & rotate?
// Do tiles want to be mirrored or kalidescoped?

// for polar
// add rotate
// choose whether inner radius is relative or absolute (0.1 could be 0.1 of width, true coule be 0.5)

// SHAPES
// circle straight forward TODO add pacman
// polar this is most other shapes

function degToRad(deg) {
	return deg*(Math.PI/180);
}

class VizShape {
	#type;
	#path;
	#x;
	#y;
	#w;
	#h;
	#fill;
	#stroke;
	#strokeWidth;
	#pointCount;
	#innerRadius;

	constructor({
		// for all
		type = 'circle', path = new Path2D(),
		x = 0, y = 0, w = 100, h = 100,
		fill = '#111', stroke = '#efefef',
		strokeWidth = 1.0,
		// for polar
		pointCount = 4, innerRadius = false,
	} = {}) {

		this.#type = type;
		this.#x = x;
		this.#y = y;
		this.#w = w;
		this.#h = h;
		this.#fill = fill;
		this.#stroke = stroke;
		this.#strokeWidth = strokeWidth;
		this.#pointCount = pointCount;
		this.#innerRadius = innerRadius;

		this.#path = path;
		this.#makePath();
	}

	// Getters & Setters
	get type() {
		return this.#type;
	}
	set type(type) {
		this.#type = type;
		this.#path = new Path2D();
		this.#makePath();
	}

	get path() {
		return this.#path;
	}
	set path(path) {
		this.#path = path;
	}

	get x() {
		return this.#x;
	}
	set x(float) {
		this.#x = float;
		this.#path = new Path2D();
		this.#makePath();
	}

	get y() {
		return this.#y;
	}
	set y(float) {
		this.#y = float;
		this.#path = new Path2D();
		this.#makePath();
	}

	get w() {
		return this.#w;
	}
	set w(float) {
		this.#w = float;
		this.#path = new Path2D();
		this.#makePath();
	}

	get h() {
		return this.#h;
	}
	set h(float) {
		this.#h = float;
		this.#path = new Path2D();
		this.#makePath();
	}

	get fill() {
		return this.#fill;
	}
	set fill(col) {
		this.#fill = col;
	}

	get stroke() {
		return this.#stroke;
	}
	set stroke(col) {
		this.#stroke = col;
	}

	get strokeWidth() {
		return this.#strokeWidth;
	}
	set strokeWidth(float) {
		this.#strokeWidth = float;
	}

	get pointCount() {
		return this.#pointCount;
	}
	set pointCount(int) {
		this.#pointCount = int;
		this.#path = new Path2D();
		this.#makePath();
	}

	get innerRadius() {
		return this.#innerRadius;
	}
	set innerRadius(boolOrInt) {
		this.#innerRadius = boolOrInt;
		this.#path = new Path2D();
		this.#makePath();
	}

	#makePath() {
		// reset path
		switch (this.#type) {
			case 'circle':
				this.#path.arc(this.#x, this.#y, this.#w/2, 0, Math.PI*2);
			break;

			case 'rect':
				this.#path.moveTo(this.#w / 2, this.#h / 2);
				this.#path.lineTo(-this.#w / 2, this.#h / 2);
				this.#path.lineTo(-this.#w / 2, -this.#h / 2);
				this.#path.lineTo(this.#w / 2, -this.#h / 2);
				this.#path.closePath()
			break;

			case 'polar':
				// double points if inner points
				let count = !this.#innerRadius ? this.#pointCount : this.#pointCount*2;
				// loop over count & draw between points
				for (let i=0; i<count; i++) {
					const theta = degToRad(i*(360/count));
					let radius = this.#w/2;
					// if innerRadius is set; half radius every other point
					if (this.#innerRadius && (i%2 === 1)) {
						radius = this.#innerRadius/2;
					}

					// draw
					if (i===0) {
						this.#path.moveTo(
							(radius * Math.cos(0)),
							(radius * Math.sin(0))
						)
					} else {
						console.log(theta);
						this.#path.lineTo(
							(radius * Math.cos(theta)),
							(radius * Math.sin(theta))
						);
					}
				} // loop
				this.#path.closePath();
			break;

			case 'drop':
				this.#path.moveTo(this.#x+(this.#w/2), this.#y);
				this.#path.arc(this.#x, this.#y, this.#w/2, 0, 4.72);
				this.#path.lineTo(this.#w/2, -this.#w/2);
				this.#path.closePath();
			break;

			default:
				// this.#path = this.#path;
		}
	}

}

/**
 * Viztile is a map of canvas 2D context shapes sized and positioned to the tiles size
 */
// TODO maybe pass ctx in here
class VizTile extends Array {

	#w;
	#h;
	#rotation = 0;

	constructor({
		w = 100, h = 100,
	} = {}) {
		super();
		this.#w = w;
		this.#h = h;

	}

	// Getters & setters
	get w() {
		return this.#w;
	}
	set w(int) {
		this.#w = int;
	}

	get h() {
		return this.#h;
	}
	set h(int) {
		this.#h = int;
	}

	rotate(degrees) {
		this.#rotation = degToRad(degrees);
	}

	addCircle(opts) {
		this.push(new VizShape({
			type: 'circle',
			x: opts.x, y: opts.y, w: opts.r,
			fill: opts.fill, stroke: opts.stroke, strokeWidth: opts.strokeWidth
		}))
	}

	addRect(opts) {
		this.push(new VizShape({
			type:'rect',
			x: opts.x, y: opts.y, w: opts.w, h: opts.h,
			fill: opts.fill, stroke: opts.stroke,
			strokeWidth: opts.strokeWidth
		}))
	}

	addPolar(opts) {
		this.push(new VizShape({
			type:'polar',
			x: opts.x, y: opts.y, w: opts.w,
			fill: opts.fill, stroke: opts.stroke,
			strokeWidth: opts.strokeWidth,
			pointCount: opts.pointCount, innerRadius: opts.innerRadius
		}))
	}

	addDrop(opts) {
		this.push(new VizShape({
			type:'drop',
			x: opts.x, y: opts.y, w: opts.w,
			fill: opts.fill, stroke: opts.stroke,
			strokeWidth: opts.strokeWidth
		}))
	}

	addShape(type, identifier) {

	}

	render(ctx) {
		// we're going to rotate the tile, not the shape TODO add rotate property to shapes
		ctx.rotate(this.#rotation);
		this.forEach(shape => {

			ctx.fillStyle = shape.fill;
			ctx.strokeStyle = shape.stroke;
			ctx.lineWidth = shape.strokeWidth;

			ctx.translate(shape.x*this.#w, shape.y*this.#h)
			// ctx.rotate(this.#rotation);
			ctx.fill(shape.path);
			if (shape.strokeWidth > 0) {
				ctx.stroke(shape.path);
			}

			// ctx.rotate(-this.#rotation);
			ctx.translate(-shape.x*this.#w, -shape.y*this.#h)

		})
		ctx.rotate(-this.#rotation);
	}
}

export default VizTile;