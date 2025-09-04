import { SudokuCell } from "../types";

export const delay = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const convertToSudokuCells = (grid: number[][]): SudokuCell[][] => {
	return grid.map((row, y) =>
		row.map((value, x) => ({
			value,
			isGiven: value !== 0,
			pencilMarks: new Set<number>(),
			x,
			y,
			isSelected: false,
			isHighlighted: false,
			hasError: false,
		}))
	);
};