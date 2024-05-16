const fs = require('fs');
const { canvasInit, clearCanvas, drawArrow, drawLine, drawCircleArrow, drawCircle, drawCircleLine, drawArcArrow } = require('./utilities');

class DrawingMatrix {
	#width = 0;
	#heigth = 0;
	#peaksCount = 0;

	#peaksCoord = [];
	#distance = 0;
	#center = 0; // (500, 500)
	#peakRadius = 30;

	#canvas = null;
	#ctx = null;

	constructor(heigth, peaksCount) {
		this.#width = heigth;
		this.#heigth = heigth;
		this.#center = heigth / 2;
		this.#distance = heigth / 2.5;
		this.#peaksCount = peaksCount;

		const { canvas, ctx } = canvasInit(this.#width, this.#heigth, '2d', '#fff');
		this.#canvas = canvas;
		this.#ctx = ctx;

		for (let i = 0; i < this.#peaksCount; i++) {
			this.#peaksCoord.push({
				x: this.#center + this.#distance * Math.cos((2 * Math.PI * i) / this.#peaksCount),
				y: this.#center + this.#distance * Math.sin((2 * Math.PI * i) / this.#peaksCount),
			});
		}
	}

	drawDirMatrix(matrixDir, outputName = 'dirGraph.jpg') {
		this.#drawPeaks();

		for (let k = 0; k < this.#peaksCount; k++) {
			for (let j = 0; j < this.#peaksCount; j++) {
				if (matrixDir[k][j] === 1) {
					if (matrixDir[k][j] === 1 && matrixDir[j][k] === 1 && j === k) {
						const circleDrawR = 20;
						const vector = [this.#peaksCoord[j].x - this.#center, this.#peaksCoord[j].y - this.#center];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						drawCircleArrow(
							this.#ctx,
							this.#peaksCoord[j].x + (this.#peakRadius + circleDrawR) * vector[0],
							this.#peaksCoord[j].y + (this.#peakRadius + circleDrawR) * vector[1],
							this.#peaksCoord[j].x + this.#peakRadius * vector[0],
							this.#peaksCoord[j].y + this.#peakRadius * vector[1],
							circleDrawR,
							3,
							'#a104c4'
						);
					} else {
						const vector = [this.#peaksCoord[j].x - this.#peaksCoord[k].x, this.#peaksCoord[j].y - this.#peaksCoord[k].y];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						const fromX = this.#peaksCoord[k].x + this.#peakRadius * vector[0];
						const fromY = this.#peaksCoord[k].y + this.#peakRadius * vector[1];
						const toX = this.#peaksCoord[j].x - this.#peakRadius * vector[0];
						const toY = this.#peaksCoord[j].y - this.#peakRadius * vector[1];

						if (matrixDir[k][j] === 1 && matrixDir[j][k] === 1) {
							const toDXY = [this.#peaksCoord[k].x - toX, this.#peaksCoord[k].y - toY];
							const angleTo = Math.atan2(toDXY[1], toDXY[0]);

							drawArcArrow(
								this.#ctx,
								fromX,
								fromY,
								this.#peaksCoord[j].x + this.#peakRadius * Math.cos(angleTo + Math.PI / 15),
								this.#peaksCoord[j].y + this.#peakRadius * Math.sin(angleTo + Math.PI / 15),
								3,
								'#0469cf'
							);
						} else {
							drawArrow(this.#ctx, fromX, fromY, toX, toY, 3, '#04b807');
						}
					}
				}
			}
		}

		this.#savePhoto(outputName);
		clearCanvas(this.#ctx, this.#width, this.#heigth);
	}

	drawUndirMatrix(matrixDir, outputName = 'undirGraph.jpg') {
		this.#drawPeaks();

		for (let k = 0; k < this.#peaksCount; k++) {
			for (let j = 0; j < this.#peaksCount; j++) {
				if (j >= k && matrixDir[k][j] === 1) {
					if (j === k) {
						const circleDrawR = 20;
						const vector = [this.#peaksCoord[j].x - this.#center, this.#peaksCoord[j].y - this.#center];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						drawCircleLine(
							this.#ctx,
							this.#peaksCoord[j].x + (this.#peakRadius + circleDrawR) * vector[0],
							this.#peaksCoord[j].y + (this.#peakRadius + circleDrawR) * vector[1],
							circleDrawR,
							3,
							'#a104c4'
						);
					} else {
						const vector = [this.#peaksCoord[j].x - this.#peaksCoord[k].x, this.#peaksCoord[j].y - this.#peaksCoord[k].y];
						const vectorLength = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
						vector[0] = vector[0] / vectorLength;
						vector[1] = vector[1] / vectorLength;

						const fromX = this.#peaksCoord[k].x + this.#peakRadius * vector[0];
						const fromY = this.#peaksCoord[k].y + this.#peakRadius * vector[1];
						const toX = this.#peaksCoord[j].x - this.#peakRadius * vector[0];
						const toY = this.#peaksCoord[j].y - this.#peakRadius * vector[1];

						drawLine(this.#ctx, fromX, fromY, toX, toY, 3, '#0469cf');
					}
				}
			}
		}

		this.#savePhoto(outputName);
		clearCanvas(this.#ctx, this.#width, this.#heigth);
	}

	#drawPeaks() {
		this.#peaksCoord.forEach((el, index) => {
			drawCircle(this.#ctx, el.x, el.y, this.#peakRadius, '#fcba03', index + 1);
		});
	}

	#savePhoto(name = 'ouput.jpg') {
		const buffer = this.#canvas.toBuffer('image/jpeg');
		const dir = `${__dirname}/../output`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		fs.writeFileSync(`${dir}/${name}`, buffer);
	}
}

module.exports = { DrawingMatrix };
