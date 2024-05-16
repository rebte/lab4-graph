const findPathsLength2And3 = matrix => {
	let n = matrix.length;
	let A2 = matrixMultiply(matrix, matrix);
	let A3 = matrixMultiply(A2, matrix);
	let startEndLength2 = [];
	let startEndLength3 = [];

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (A2[i][j] > 0) {
				startEndLength2.push([i, j]);
			}
		}
	}

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (A3[i][j] > 0) {
				startEndLength3.push([i, j]);
			}
		}
	}

	const pathsLength2 = [];
	const pathsLength3 = [];

	startEndLength2.forEach(([first, last]) => {
		for (let i = 0; i < n; i++) {
			if (matrix[first][i] === 1 && matrix[i][last] === 1) {
				const path = [first, i, last];
				if (new Set(path).size === path.length) {
					pathsLength2.push(path);
				}
			}
		}
	});

	startEndLength3.forEach(([first, last]) => {
		for (let i = 0; i < n; i++) {
			if (matrix[first][i] === 0) continue;
			for (let j = 0; j < n; j++) {
				if (matrix[i][j] === 1 && matrix[j][last] === 1) {
					const path = [first, i, j, last];
					if (new Set(path).size === path.length) {
						pathsLength3.push(path);
					}
				}
			}
		}
	});

	return { pathsLength2, pathsLength3 };
};

const findReachableMatrix = matrix => {
	const n = matrix.length;
	let newMatrix = Array.from({ length: n }, () => Array(n).fill(0));

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (i === j || matrix[i][j] === 1) {
				newMatrix[i][j] = 1;
			}
		}
	}

	for (let k = 0; k < n; k++) {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				newMatrix[i][j] = newMatrix[i][j] || (newMatrix[i][k] && newMatrix[k][j]);
			}
		}
	}

	return newMatrix;
};

const stronglyConnectionsMatrix = matrix => {
	let visited = [];
	let stack = [];

	for (let i = 0; i < matrix.length; i++) {
		if (!visited.includes(i)) {
			findStack(i, matrix, visited, stack);
		}
	}

	const transpose = getTranspose(matrix);
	const scc = [];
	visited = [];

	stack.reverse().forEach(el => {
		if (!visited.includes(el)) {
			let component = [];
			findScc(el, transpose, visited, component);
			scc.push(component);
		}
	});

	return scc;
};

const findStack = (index, matrix, visited, stack) => {
	visited.push(index);
	matrix[index].forEach((el, i) => {
		if (el === 1 && !visited.includes(i)) {
			findStack(i, matrix, visited, stack);
		}
	});
	stack.push(index);
};

const findScc = (index, matrix, visited, component) => {
	visited.push(index);
	component.push(index);
	matrix[index].forEach((el, i) => {
		if (el === 1 && !visited.includes(i)) {
			findScc(i, matrix, visited, component);
		}
	});
};

const getTranspose = matrix => {
	return matrix[0].map((col, i) => matrix.map(row => row[i]));
};
const matrixMultiply = (a, b) => {
	const m = new Array(a.length);

	for (let row = 0; row < a.length; row++) {
		m[row] = new Array(b[0].length);

		for (let column = 0; column < b[0].length; column++) {
			m[row][column] = 0;

			for (let i = 0; i < a[0].length; i++) {
				m[row][column] += a[row][i] * b[i][column];
			}
		}
	}

	return m;
};

module.exports = {
	findPathsLength2And3,
	findReachableMatrix,
	stronglyConnectionsMatrix,
};
