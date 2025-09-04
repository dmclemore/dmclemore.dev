import { SudokuCell } from "../types";

export const isValidPlacement = (grid: number[][], row: number, col: number, num: number): boolean => {
	// Check row
	for (let x = 0; x < 9; x++) {
		if (grid[row][x] === num) return false;
	}

	// Check column
	for (let x = 0; x < 9; x++) {
		if (grid[x][col] === num) return false;
	}

	// Check 3x3 box
	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (grid[boxRow + i][boxCol + j] === num) return false;
		}
	}

	return true;
};

export const isValidCellPlacement = (cells: SudokuCell[][], row: number, col: number, num: number): boolean => {
	// Check row
	for (let x = 0; x < 9; x++) {
		if (cells[row][x].value === num) return false;
	}

	// Check column
	for (let x = 0; x < 9; x++) {
		if (cells[x][col].value === num) return false;
	}

	// Check 3x3 box
	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (cells[boxRow + i][boxCol + j].value === num) return false;
		}
	}

	return true;
};

export const hasConflicts = (cells: SudokuCell[][], row: number, col: number): boolean => {
	const cell = cells[row][col];
	if (cell.value === 0) return false;

	// Check for duplicates in row
	for (let c = 0; c < 9; c++) {
		if (c !== col && cells[row][c].value === cell.value) return true;
	}

	// Check for duplicates in column
	for (let r = 0; r < 9; r++) {
		if (r !== row && cells[r][col].value === cell.value) return true;
	}

	// Check for duplicates in box
	const boxRow = Math.floor(row / 3) * 3;
	const boxCol = Math.floor(col / 3) * 3;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const r = boxRow + i;
			const c = boxCol + j;
			if ((r !== row || c !== col) && cells[r][c].value === cell.value) return true;
		}
	}

	return false;
};

export const getPossibleValues = (cells: SudokuCell[][], row: number, col: number): number[] => {
	if (cells[row][col].value !== 0) return [];
	
	const possible: number[] = [];
	const numberGrid = cells.map(r => r.map(c => c.value));
	
	for (let num = 1; num <= 9; num++) {
		if (isValidPlacement(numberGrid, row, col, num)) {
			possible.push(num);
		}
	}
	
	return possible;
};

export const isSolved = (cells: SudokuCell[][]): boolean => {
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			if (cells[row][col].value === 0) return false;
		}
	}
	return true;
};