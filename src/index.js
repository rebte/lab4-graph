const { randomInit } = require('./random');
const { printMatrix } = require('./utilities');
const { DrawingMatrix } = require('./drawingMatrix');
const { findPathsLength2And3, findReachableMatrix, stronglyConnectionsMatrix } = require('./matrixFunctions');
// 3410

const n = 10 + 1;
const seed = 3410;
let coef = 1 - 1 * 0.01 - 0 * 0.001 - 0.3;
let matrixDir = [];
const matrixUndir = [];

const random = randomInit(seed, 0, 2);

for (let k = 0; k < n; k++) {
	matrixDir[k] = [];
	if (!matrixUndir[k]) {
		matrixUndir[k] = [];
	}

	for (let j = 0; j < n; j++) {
		const v = Math.floor(random() * coef);
		matrixDir[k][j] = v;

		if (!matrixUndir[k][j]) {
			matrixUndir[k][j] = v;
		}

		if (v === 1 && k !== j) {
			if (!matrixUndir[j]) {
				matrixUndir[j] = [];
			}
			matrixUndir[j][k] = v;
		}
	}
}

console.log('Направлена матриця:');
printMatrix(matrixDir);
console.log('\nНенаправлена матриця:');
printMatrix(matrixUndir);

const drawingMatrix = new DrawingMatrix(1000, n);

drawingMatrix.drawDirMatrix(matrixDir);
drawingMatrix.drawUndirMatrix(matrixUndir);

// lab 4.1
const peeksDegreesDir = [];

console.log('\nCтепенi вершин напрямленого графа. (вихід, захід)');
for (let k = 0; k < n; k++) {
	let peekDegreesDirEntry = 0;
	let peekDegreesDirExit = 0;

	for (let j = 0; j < n; j++) {
		if (matrixDir[k][j] === 1 || matrixDir[j][k] === 1) {
			if (matrixDir[k][j] === 1) {
				peekDegreesDirExit += 1;
			}
			if (matrixDir[j][k] === 1) {
				peekDegreesDirEntry += 1;
			}
		}
	}

	let hangingPeak = (peekDegreesDirEntry === 0 && peekDegreesDirExit > 0) || (peekDegreesDirEntry > 0 && peekDegreesDirExit === 0);
	let isolatedPeak = peekDegreesDirEntry === 0 && peekDegreesDirExit === 0;

	peeksDegreesDir.push(peekDegreesDirExit + peekDegreesDirEntry);
	console.log(
		`Cтепень ${k + 1}-вершини - ${peekDegreesDirExit + peekDegreesDirEntry}(${peekDegreesDirExit}, ${peekDegreesDirEntry}). ${hangingPeak ? 'Вершина є висячею' : isolatedPeak ? 'Вершина є ізольованою' : ''}`
	);
}

const isRegularDir = peeksDegreesDir.filter(el => el === peeksDegreesDir[0]).length === peeksDegreesDir.length;

if (isRegularDir) {
	console.log(`\nГраф є однорідним. Степінь однорідності графа - ${peeksDegreesDir[0]}`);
} else {
	console.log('\nГраф не є однорідним');
}

///

const peeksDegreesUndir = [];

console.log('\nCтепенi вершин ненапрямленого графа.');
for (let k = 0; k < n; k++) {
	const peekSum = matrixUndir[k].reduce((acc, val) => acc + val, 0);

	let hangingPeak = peekSum === 1;
	let isolatedPeak = peekSum === 0;

	peeksDegreesUndir.push(peekSum);
	console.log(`Cтепень ${k + 1}-вершини ненапрямленого - ${peekSum}. ${hangingPeak ? 'Вершина є висячею' : isolatedPeak ? 'Вершина є ізольованою' : ''}`);
}

const isRegularUndir = peeksDegreesUndir.filter(el => el === peeksDegreesUndir[0]).length === peeksDegreesUndir.length;

if (isRegularUndir) {
	console.log(`\nГраф є однорідним. Степінь однорідності графа - ${peeksDegreesUndir[0]}`);
} else {
	console.log('\nГраф не є однорідним');
}

//*//

coef = 1 - 1 * 0.005 - 0 * 0.005 - 0.27;
matrixDir = [];

for (let k = 0; k < n; k++) {
	matrixDir[k] = [];
	for (let j = 0; j < n; j++) {
		const v = Math.floor(random() * coef);
		matrixDir[k][j] = v;
	}
}

drawingMatrix.drawDirMatrix(matrixDir, 'secondDirGraph.jpg');

console.log('\nНаправлена нова матриця:');
printMatrix(matrixDir);

console.log('\nCтепенi вершин напрямленого графа. (вихід, захід)');
for (let k = 0; k < n; k++) {
	let peekDegreesDirEntry = 0;
	let peekDegreesDirExit = 0;

	for (let j = 0; j < n; j++) {
		if (matrixDir[k][j] === 1 || matrixDir[j][k] === 1) {
			if (matrixDir[k][j] === 1) {
				peekDegreesDirExit += 1;
			}
			if (matrixDir[j][k] === 1) {
				peekDegreesDirEntry += 1;
			}
		}
	}

	peeksDegreesDir.push(peekDegreesDirExit + peekDegreesDirEntry);
	console.log(`Cтепень ${k + 1}-вершини - ${peekDegreesDirExit + peekDegreesDirEntry}(${peekDegreesDirExit}, ${peekDegreesDirEntry}).`);
}

const { pathsLength2, pathsLength3 } = findPathsLength2And3(matrixDir);

console.log('\nВсі шляхи довжиною 2');
pathsLength2.forEach(el => console.log(`${el.join(', ')}`));

console.log('\nВсі шляхи довжиною 3');
pathsLength3.forEach(el => console.log(`${el.join(', ')}`));

const reachableMatrix = findReachableMatrix(matrixDir);

console.log('\nMатриця досяжностi');
printMatrix(reachableMatrix);

const scc = stronglyConnectionsMatrix(matrixDir);
const sccMap = new Map();
const strongMatrix = Array.from({ length: n }, () => Array(n).fill(0));

console.log('\nКомпоненти сильної зв’язностi');
scc.forEach((comp, i) => {
	console.log(`Група ${i + 1} - ${comp.join(', ')}`);
	comp.forEach(el => {
		sccMap.set(el, i);
	});
});

for (let k = 0; k < n; k++) {
	for (let j = 0; j < n; j++) {
		if (sccMap.get(k) === sccMap.get(j)) {
			strongMatrix[k][j] = 1;
		}
	}
}

console.log('\nМатриця сильної зв’язності');
printMatrix(strongMatrix);

const condensationMatrix = Array.from({ length: scc.length }, () => Array(scc.length).fill(0));

for (let k = 0; k < n; k++) {
	for (let j = 0; j < n; j++) {
		if (sccMap.get(k) === sccMap.get(j)) continue;
		if (matrixDir[k][j] === 1) {
			condensationMatrix[sccMap.get(k)][sccMap.get(j)] = 1;
		}
	}
}

console.log('\nГраф конденсацiї');
printMatrix(condensationMatrix);

const drawingCondensationMatrix = new DrawingMatrix(1000, condensationMatrix.length);
drawingCondensationMatrix.drawDirMatrix(condensationMatrix, 'condensationGraph.jpg');
