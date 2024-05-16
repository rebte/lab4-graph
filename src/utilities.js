const { createCanvas } = require('canvas');

const printMatrix = matrix => {
	for (let k = 0; k < matrix.length; k++) {
		console.log(matrix[k].join(', '));
	}
};

const canvasInit = (width, heigth, context, color) => {
	const canvas = createCanvas(width, heigth);
	const ctx = canvas.getContext(context);

	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, heigth);

	return { canvas, ctx };
};

const clearCanvas = (ctx, width, heigth) => {
	ctx.clearRect(0, 0, width, heigth);
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, width, heigth);
	ctx.restore();
};

const drawArrow = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
	const headlen = 5;
	const angle = Math.atan2(toy - fromy, tox - fromx);

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawLine = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();
	ctx.restore();
};

const drawArcArrow = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
	const midX = (fromx + tox) / 2;
	const midY = (fromy + toy) / 2;
	const ctrlX = midX + (toy - fromy) * 0.05;
	const ctrlY = midY + (fromx - tox) * 0.05;
	const headlen = 5;
	const angle = Math.atan2(toy - fromy, tox - fromx);

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.quadraticCurveTo(ctrlX, ctrlY, tox, toy);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(tox, toy);
	ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawCircleArrow = (ctx, centerX, centerY, concernedX, concernedY, r, arrowWidth, color) => {
	const headlen = 10;
	const angle = Math.atan2(centerY - concernedY, centerX - concernedX) - 8;

	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
	ctx.lineWidth = arrowWidth;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(concernedX, concernedY);
	ctx.lineTo(concernedX - headlen * Math.cos(angle - Math.PI / 7), concernedY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.lineTo(concernedX - headlen * Math.cos(angle + Math.PI / 7), concernedY - headlen * Math.sin(angle + Math.PI / 7));

	ctx.lineTo(concernedX, concernedY);
	ctx.lineTo(concernedX - headlen * Math.cos(angle - Math.PI / 7), concernedY - headlen * Math.sin(angle - Math.PI / 7));

	ctx.stroke();
	ctx.restore();
};

const drawCircleLine = (ctx, centerX, centerY, r, arrowWidth, color) => {
	ctx.save();
	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
	ctx.lineWidth = arrowWidth;

	ctx.stroke();
	ctx.restore();
};

const drawCircle = (ctx, x, y, r, color, text) => {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();

	ctx.font = '15pt Calibri';
	ctx.fillStyle = '#000';
	ctx.textAlign = 'center';
	ctx.fillText(text, x, y + 7);
};

module.exports = {
	printMatrix,
	drawArrow,
	drawLine,
	drawArcArrow,
	drawCircleArrow,
	drawCircleLine,
	drawCircle,
	canvasInit,
	clearCanvas,
};
