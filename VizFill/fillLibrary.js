// fill styles ++++++++++++++++
	// I think these should be there own class & added into palette
	static fillDots(dotCol = '#111', bgCol = '#eee', size = 16) {
		size = size*2;
		const offCan = new OffscreenCanvas(size, size);
		const offCtx = offCan.getContext('2d');
		offCtx.fillStyle = bgCol;
		offCtx.fillRect(0, 0, size, size);
		offCtx.fillStyle = dotCol;
		offCtx.arc(size / 4, size / 4, size / 6, 0, Math.PI*2);
		offCtx.arc(size / 1.33, size / 1.33, size / 6, 0, Math.PI*2);
		offCtx.fill();
		return offCtx.createPattern(offCan, 'repeat');
	}

	static fillDotGrid(dotCol = '#111', bgCol = '#eee', size = 16) {
		const offCan = new OffscreenCanvas(size, size);
		const offCtx = offCan.getContext('2d');
		offCtx.fillStyle = bgCol;
		offCtx.fillRect(0, 0, size, size);
		offCtx.fillStyle = dotCol;
		offCtx.arc(size / 2, size / 2, size / 4, 0, Math.PI*2);
		offCtx.fill();
		return offCtx.createPattern(offCan, 'repeat');
	}

	static fillLines(lineCol = '#111', bgCol = '#eee', size = 16, lineWidth = 4, rotation = 0) {
		const offCan = new OffscreenCanvas(size, size);
		const offCtx = offCan.getContext('2d');
		// background
		offCtx.fillStyle = bgCol;
		offCtx.fillRect(0, 0, size, size);
		// rotate the canvas
		offCtx.translate(size/2, size/2);
		offCtx.rotate(rotation);
		offCtx.translate(-size/2, -size/2);
		// draw line
		offCtx.strokeStyle = lineCol;
		offCtx.lineWidth = lineWidth;
		offCtx.moveTo(size/2, 0-(size/4));
		offCtx.lineTo(size/2, size+(size/4));
		offCtx.stroke();

		return offCtx.createPattern(offCan, 'repeat');
	}

	static fillGrid(lineCol = '#111', bgCol = '#eee', size = 16, lineWidth = 4, rotation = 0) {
		const offCan = new OffscreenCanvas(size, size);
		const offCtx = offCan.getContext('2d');
		// background
		offCtx.fillStyle = bgCol;
		offCtx.fillRect(0, 0, size, size);
		// rotate the canvas
		offCtx.translate(size/2, size/2);
		offCtx.rotate(rotation);
		offCtx.translate(-size/2, -size/2);
		// draw line
		offCtx.strokeStyle = lineCol;
		offCtx.lineWidth = lineWidth;
		offCtx.moveTo(size/2, 0-(size/4));
		offCtx.lineTo(size/2, size+(size/4));
		offCtx.moveTo(0-(size/4), size/2);
		offCtx.lineTo(size+(size/4), size/2);
		offCtx.stroke();

		return offCtx.createPattern(offCan, 'repeat');
	}

	static fillCheckered(squareCol = '#111', bgCol = '#eee', size = 16) {
		const offCan = new OffscreenCanvas(size*2, size*2);
		const offCtx = offCan.getContext('2d');
		offCtx.fillStyle = bgCol;
		offCtx.fillRect(0, 0, size*2, size*2);
		offCtx.fillStyle = squareCol;
		offCtx.fillRect(0, 0, size, size);
		offCtx.fillRect(size, size, size, size);

		return offCtx.createPattern(offCan, 'repeat');
	}

	static fillLinearGrad(colOne = '#111', colTwo = '#eee', size = 50) {
		const offCan = new OffscreenCanvas(size, size);
		const offCtx = offCan.getContext('2d');
		const gradient = offCtx.createLinearGradient(0, 0, size, -size);
		gradient.addColorStop(0, colOne);
		gradient.addColorStop(1, colTwo);
		return gradient;
	}